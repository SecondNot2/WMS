import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { logActivity } from "../lib/activityLog";
import {
  emitOutboundApproved,
  emitOutboundRejected,
  emitStockUpdated,
} from "../lib/websocket";
import type {
  CreateOutboundSchemaInput,
  GetOutboundsQuerySchemaInput,
  OutboundItemSchemaInput,
  UpdateOutboundSchemaInput,
} from "@wms/validations";

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

const outboundListInclude = {
  recipient: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
  _count: { select: { items: true } },
} satisfies Prisma.GoodsIssueInclude;

const outboundDetailInclude = {
  recipient: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
    },
  },
  createdBy: { select: { id: true, name: true } },
  items: {
    orderBy: { id: "asc" },
    include: {
      product: {
        select: {
          id: true,
          sku: true,
          name: true,
          unit: true,
          currentStock: true,
        },
      },
    },
  },
} satisfies Prisma.GoodsIssueInclude;

async function generateOutboundCode(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const year = new Date().getFullYear();
  const latest = await tx.goodsIssue.findFirst({
    where: { code: { startsWith: `PXK-${year}-` } },
    orderBy: { code: "desc" },
    select: { code: true },
  });
  const nextNumber = latest
    ? Number.parseInt(latest.code.split("-")[2] ?? "0", 10) + 1
    : 1;
  return `PXK-${year}-${String(nextNumber).padStart(4, "0")}`;
}

function assertItemsValid(items: OutboundItemSchemaInput[]) {
  if (items.length === 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Phiếu xuất phải có ít nhất 1 sản phẩm",
    );
  }
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.productId)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "Sản phẩm bị lặp trong phiếu — vui lòng gộp số lượng",
      );
    }
    seen.add(item.productId);
  }
}

async function assertRecipientActive(recipientId: string) {
  const recipient = await prisma.recipient.findFirst({
    where: { id: recipientId, isActive: true },
    select: { id: true },
  });
  if (!recipient) {
    throw new AppError("VALIDATION_ERROR", "Đơn vị nhận không tồn tại");
  }
}

/**
 * Load active products + validate stock đủ để xuất.
 * Trả về map productId → product để caller dùng tiếp.
 */
async function loadProductsForOutbound(
  items: OutboundItemSchemaInput[],
  client: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const productIds = items.map((i) => i.productId);
  const products = await client.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: {
      id: true,
      sku: true,
      name: true,
      unit: true,
      currentStock: true,
    },
  });
  if (products.length !== productIds.length) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Một hoặc nhiều sản phẩm không tồn tại hoặc đã ngừng hoạt động",
    );
  }

  const map = new Map(products.map((p) => [p.id, p]));
  for (const item of items) {
    const p = map.get(item.productId);
    if (!p) continue;
    if (p.currentStock < item.quantity) {
      throw new AppError(
        "INSUFFICIENT_STOCK",
        `${p.sku} chỉ còn ${p.currentStock} ${p.unit}, không đủ để xuất ${item.quantity}`,
      );
    }
  }
  return map;
}

function computeTotalAmount(items: OutboundItemSchemaInput[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function serializeListItem(issue: {
  id: string;
  code: string;
  status: string;
  purpose: string | null;
  totalAmount: Prisma.Decimal;
  createdAt: Date;
  recipient: { id: string; name: string };
  createdBy: { id: string; name: string };
  _count: { items: number };
}) {
  const { _count, totalAmount, ...rest } = issue;
  return {
    ...rest,
    totalAmount: Number(totalAmount),
    itemCount: _count.items,
  };
}

// ─────────────────────────────────────────
// Queries
// ─────────────────────────────────────────

export async function getOutbounds(query: GetOutboundsQuerySchemaInput) {
  const { page, limit, search, status, recipientId, from, to } = query;

  const where: Prisma.GoodsIssueWhereInput = {
    ...(status && { status }),
    ...(recipientId && { recipientId }),
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
        { purpose: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...((from || to) && {
      createdAt: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    }),
  };

  const [items, total] = await Promise.all([
    prisma.goodsIssue.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: outboundListInclude,
    }),
    prisma.goodsIssue.count({ where }),
  ]);

  return {
    data: items.map(serializeListItem),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getOutboundStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const [thisMonth, pending, approvedToday, rejected] = await Promise.all([
    prisma.goodsIssue.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.goodsIssue.count({ where: { status: "PENDING" } }),
    prisma.goodsIssue.count({
      where: { status: "APPROVED", issuedAt: { gte: startOfToday } },
    }),
    prisma.goodsIssue.count({
      where: { status: "REJECTED", createdAt: { gte: startOfMonth } },
    }),
  ]);

  return { thisMonth, pending, approvedToday, rejected };
}

export async function getOutboundById(id: string) {
  const issue = await prisma.goodsIssue.findUnique({
    where: { id },
    include: outboundDetailInclude,
  });
  if (!issue) {
    throw new AppError("NOT_FOUND", "Phiếu xuất không tồn tại");
  }

  let approvedBy: { id: string; name: string } | null = null;
  if (issue.approvedById) {
    approvedBy = await prisma.user.findUnique({
      where: { id: issue.approvedById },
      select: { id: true, name: true },
    });
  }

  return {
    id: issue.id,
    code: issue.code,
    recipient: issue.recipient,
    status: issue.status,
    purpose: issue.purpose,
    note: issue.note,
    totalAmount: Number(issue.totalAmount),
    createdBy: issue.createdBy,
    approvedBy,
    rejectedReason: issue.rejectedReason,
    issuedAt: issue.issuedAt,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    items: issue.items.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
  };
}

// ─────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────

export async function createOutbound(
  input: CreateOutboundSchemaInput,
  userId: string,
) {
  assertItemsValid(input.items);
  await assertRecipientActive(input.recipientId);
  await loadProductsForOutbound(input.items);

  const totalAmount = computeTotalAmount(input.items);

  const created = await prisma.$transaction(async (tx) => {
    const code = await generateOutboundCode(tx);
    return tx.goodsIssue.create({
      data: {
        code,
        recipientId: input.recipientId,
        createdById: userId,
        purpose: input.purpose,
        note: input.note ?? null,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: outboundListInclude,
    });
  });

  await logActivity({
    userId,
    action: "outbound.create",
    targetType: "GoodsIssue",
    targetId: created.id,
    targetCode: created.code,
    detail: { itemCount: input.items.length, totalAmount },
  });

  return serializeListItem(created);
}

export async function updateOutbound(
  id: string,
  input: UpdateOutboundSchemaInput,
  userId: string,
) {
  const existing = await prisma.goodsIssue.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!existing) {
    throw new AppError("NOT_FOUND", "Phiếu xuất không tồn tại");
  }
  if (existing.status !== "PENDING") {
    throw new AppError(
      "CONFLICT",
      "Chỉ có thể sửa phiếu ở trạng thái Chờ duyệt",
    );
  }

  if (input.recipientId) await assertRecipientActive(input.recipientId);
  if (input.items) {
    assertItemsValid(input.items);
    await loadProductsForOutbound(input.items);
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (input.items) {
      await tx.goodsIssueItem.deleteMany({ where: { goodsIssueId: id } });
      await tx.goodsIssueItem.createMany({
        data: input.items.map((item) => ({
          goodsIssueId: id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        })),
      });
    }

    const totalAmount = input.items
      ? computeTotalAmount(input.items)
      : undefined;

    return tx.goodsIssue.update({
      where: { id },
      data: {
        ...(input.recipientId !== undefined && {
          recipientId: input.recipientId,
        }),
        ...(input.purpose !== undefined && { purpose: input.purpose }),
        ...(input.note !== undefined && { note: input.note }),
        ...(totalAmount !== undefined && { totalAmount }),
      },
      include: outboundListInclude,
    });
  });

  await logActivity({
    userId,
    action: "outbound.update",
    targetType: "GoodsIssue",
    targetId: updated.id,
    targetCode: updated.code,
    detail: {
      ...(input.recipientId && { recipientId: input.recipientId }),
      ...(input.items && { itemCount: input.items.length }),
    },
  });

  return serializeListItem(updated);
}

export async function deleteOutbound(id: string, userId: string) {
  const existing = await prisma.goodsIssue.findUnique({
    where: { id },
    select: { id: true, status: true, code: true },
  });
  if (!existing) {
    throw new AppError("NOT_FOUND", "Phiếu xuất không tồn tại");
  }
  if (existing.status !== "PENDING") {
    throw new AppError(
      "CONFLICT",
      "Chỉ có thể xóa phiếu ở trạng thái Chờ duyệt",
    );
  }

  await prisma.goodsIssue.delete({ where: { id } });

  await logActivity({
    userId,
    action: "outbound.delete",
    targetType: "GoodsIssue",
    targetId: existing.id,
    targetCode: existing.code,
  });
}

export async function approveOutbound(id: string, userId: string) {
  const issue = await prisma.goodsIssue.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!issue) {
    throw new AppError("NOT_FOUND", "Phiếu xuất không tồn tại");
  }
  if (issue.status !== "PENDING") {
    throw new AppError("CONFLICT", "Phiếu đã được xử lý");
  }

  await prisma.$transaction(async (tx) => {
    // Re-validate stock at approve time
    await loadProductsForOutbound(
      issue.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
      })),
      tx,
    );

    await tx.goodsIssue.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: userId,
        issuedAt: new Date(),
      },
    });

    for (const item of issue.items) {
      const updatedProduct = await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { decrement: item.quantity } },
        select: { currentStock: true },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          type: "OUT",
          quantity: item.quantity,
          stockBefore: updatedProduct.currentStock + item.quantity,
          stockAfter: updatedProduct.currentStock,
          refId: id,
          refCode: issue.code,
          createdById: userId,
        },
      });
    }
  });

  emitStockUpdated(issue.items.map((i) => i.productId));
  emitOutboundApproved({
    id,
    code: issue.code,
    status: "APPROVED",
    approvedById: userId,
  });

  await logActivity({
    userId,
    action: "outbound.approve",
    targetType: "GoodsIssue",
    targetId: id,
    targetCode: issue.code,
    detail: { itemCount: issue.items.length },
  });

  return getOutboundById(id);
}

export async function rejectOutbound(
  id: string,
  reason: string,
  userId: string,
) {
  const issue = await prisma.goodsIssue.findUnique({
    where: { id },
    select: { id: true, status: true, code: true },
  });
  if (!issue) {
    throw new AppError("NOT_FOUND", "Phiếu xuất không tồn tại");
  }
  if (issue.status !== "PENDING") {
    throw new AppError("CONFLICT", "Phiếu đã được xử lý");
  }

  await prisma.goodsIssue.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedById: userId,
      rejectedReason: reason,
    },
  });

  emitOutboundRejected({
    id,
    code: issue.code,
    status: "REJECTED",
    rejectedReason: reason,
  });

  await logActivity({
    userId,
    action: "outbound.reject",
    targetType: "GoodsIssue",
    targetId: id,
    targetCode: issue.code,
    detail: { reason },
  });

  return getOutboundById(id);
}

// ─────────────────────────────────────────
// Export Excel
// ─────────────────────────────────────────

export async function exportOutbounds(query: GetOutboundsQuerySchemaInput) {
  const { search, status, recipientId, from, to } = query;

  const where: Prisma.GoodsIssueWhereInput = {
    ...(status && { status }),
    ...(recipientId && { recipientId }),
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
        { purpose: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...((from || to) && {
      createdAt: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    }),
  };

  return prisma.goodsIssue.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      recipient: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      items: {
        include: {
          product: { select: { sku: true, name: true, unit: true } },
        },
      },
    },
  });
}
