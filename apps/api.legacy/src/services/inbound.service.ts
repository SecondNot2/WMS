import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { logActivity } from "../lib/activityLog";
import {
  emitInboundApproved,
  emitInboundCreated,
  emitInboundRejected,
  emitStockUpdated,
} from "../lib/websocket";
import type {
  CreateInboundSchemaInput,
  GetInboundsQuerySchemaInput,
  InboundItemSchemaInput,
  UpdateInboundSchemaInput,
} from "@wms/validations";

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

const inboundListInclude = {
  supplier: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
  _count: { select: { items: true } },
} satisfies Prisma.GoodsReceiptInclude;

const inboundDetailInclude = {
  supplier: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      address: true,
      taxCode: true,
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
} satisfies Prisma.GoodsReceiptInclude;

async function generateInboundCode(
  tx: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const year = new Date().getFullYear();
  const latest = await tx.goodsReceipt.findFirst({
    where: { code: { startsWith: `PNK-${year}-` } },
    orderBy: { code: "desc" },
    select: { code: true },
  });
  const nextNumber = latest
    ? Number.parseInt(latest.code.split("-")[2] ?? "0", 10) + 1
    : 1;
  return `PNK-${year}-${String(nextNumber).padStart(4, "0")}`;
}

function assertItemsValid(items: InboundItemSchemaInput[]) {
  if (items.length === 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Phiếu nhập phải có ít nhất 1 sản phẩm",
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

async function loadActiveProducts(productIds: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    select: { id: true },
  });
  if (products.length !== productIds.length) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Một hoặc nhiều sản phẩm không tồn tại hoặc đã ngừng hoạt động",
    );
  }
}

async function assertSupplierActive(supplierId: string) {
  const supplier = await prisma.supplier.findFirst({
    where: { id: supplierId, isActive: true },
    select: { id: true },
  });
  if (!supplier) {
    throw new AppError("VALIDATION_ERROR", "Nhà cung cấp không tồn tại");
  }
}

function computeTotalAmount(items: InboundItemSchemaInput[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

function serializeListItem(receipt: {
  id: string;
  code: string;
  status: string;
  totalAmount: Prisma.Decimal;
  createdAt: Date;
  supplier: { id: string; name: string };
  createdBy: { id: string; name: string };
  _count: { items: number };
}) {
  const { _count, totalAmount, ...rest } = receipt;
  return {
    ...rest,
    totalAmount: Number(totalAmount),
    itemCount: _count.items,
  };
}

// ─────────────────────────────────────────
// Queries
// ─────────────────────────────────────────

export async function getInbounds(query: GetInboundsQuerySchemaInput) {
  const { page, limit, search, status, supplierId, from, to } = query;

  const where: Prisma.GoodsReceiptWhereInput = {
    ...(status && { status }),
    ...(supplierId && { supplierId }),
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
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
    prisma.goodsReceipt.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: inboundListInclude,
    }),
    prisma.goodsReceipt.count({ where }),
  ]);

  return {
    data: items.map(serializeListItem),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getInboundStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const [thisMonth, pending, approvedToday, rejected] = await Promise.all([
    prisma.goodsReceipt.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.goodsReceipt.count({ where: { status: "PENDING" } }),
    prisma.goodsReceipt.count({
      where: { status: "APPROVED", receivedAt: { gte: startOfToday } },
    }),
    prisma.goodsReceipt.count({
      where: { status: "REJECTED", createdAt: { gte: startOfMonth } },
    }),
  ]);

  return { thisMonth, pending, approvedToday, rejected };
}

export async function getInboundById(id: string) {
  const receipt = await prisma.goodsReceipt.findUnique({
    where: { id },
    include: inboundDetailInclude,
  });
  if (!receipt) {
    throw new AppError("NOT_FOUND", "Phiếu nhập không tồn tại");
  }

  let approvedBy: { id: string; name: string } | null = null;
  if (receipt.approvedById) {
    approvedBy = await prisma.user.findUnique({
      where: { id: receipt.approvedById },
      select: { id: true, name: true },
    });
  }

  return {
    id: receipt.id,
    code: receipt.code,
    supplier: receipt.supplier,
    status: receipt.status,
    note: receipt.note,
    totalAmount: Number(receipt.totalAmount),
    createdBy: receipt.createdBy,
    approvedBy,
    rejectedReason: receipt.rejectedReason,
    receivedAt: receipt.receivedAt,
    createdAt: receipt.createdAt,
    updatedAt: receipt.updatedAt,
    items: receipt.items.map((item) => ({
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

export async function createInbound(
  input: CreateInboundSchemaInput,
  userId: string,
) {
  assertItemsValid(input.items);
  await assertSupplierActive(input.supplierId);
  await loadActiveProducts(input.items.map((i) => i.productId));

  const totalAmount = computeTotalAmount(input.items);

  const created = await prisma.$transaction(async (tx) => {
    const code = await generateInboundCode(tx);
    return tx.goodsReceipt.create({
      data: {
        code,
        supplierId: input.supplierId,
        createdById: userId,
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
      include: inboundListInclude,
    });
  });

  return serializeListItem(created);
}

export async function updateInbound(
  id: string,
  input: UpdateInboundSchemaInput,
  userId: string,
) {
  const existing = await prisma.goodsReceipt.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!existing) {
    throw new AppError("NOT_FOUND", "Phiếu nhập không tồn tại");
  }
  if (existing.status !== "PENDING") {
    throw new AppError(
      "CONFLICT",
      "Chỉ có thể sửa phiếu ở trạng thái Chờ duyệt",
    );
  }

  if (input.supplierId) await assertSupplierActive(input.supplierId);
  if (input.items) {
    assertItemsValid(input.items);
    await loadActiveProducts(input.items.map((i) => i.productId));
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (input.items) {
      await tx.goodsReceiptItem.deleteMany({ where: { goodsReceiptId: id } });
      await tx.goodsReceiptItem.createMany({
        data: input.items.map((item) => ({
          goodsReceiptId: id,
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

    return tx.goodsReceipt.update({
      where: { id },
      data: {
        ...(input.supplierId !== undefined && { supplierId: input.supplierId }),
        ...(input.note !== undefined && { note: input.note }),
        ...(totalAmount !== undefined && { totalAmount }),
      },
      include: inboundListInclude,
    });
  });

  await logActivity({
    userId,
    action: "inbound.update",
    targetType: "GoodsReceipt",
    targetId: updated.id,
    targetCode: updated.code,
    detail: {
      ...(input.supplierId && { supplierId: input.supplierId }),
      ...(input.items && { itemCount: input.items.length }),
    },
  });

  return serializeListItem(updated);
}

export async function deleteInbound(id: string, userId: string) {
  const existing = await prisma.goodsReceipt.findUnique({
    where: { id },
    select: { id: true, status: true, code: true },
  });
  if (!existing) {
    throw new AppError("NOT_FOUND", "Phiếu nhập không tồn tại");
  }
  if (existing.status !== "PENDING") {
    throw new AppError(
      "CONFLICT",
      "Chỉ có thể xóa phiếu ở trạng thái Chờ duyệt",
    );
  }

  // Cascade xóa items qua quan hệ Prisma
  await prisma.goodsReceipt.delete({ where: { id } });

  await logActivity({
    userId,
    action: "inbound.delete",
    targetType: "GoodsReceipt",
    targetId: existing.id,
    targetCode: existing.code,
  });
}

export async function approveInbound(id: string, userId: string) {
  const receipt = await prisma.goodsReceipt.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!receipt) {
    throw new AppError("NOT_FOUND", "Phiếu nhập không tồn tại");
  }
  if (receipt.status !== "PENDING") {
    throw new AppError("CONFLICT", "Phiếu đã được xử lý");
  }

  await prisma.$transaction(async (tx) => {
    await tx.goodsReceipt.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedById: userId,
        receivedAt: new Date(),
      },
    });

    for (const item of receipt.items) {
      const updatedProduct = await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: { increment: item.quantity } },
        select: { currentStock: true },
      });

      await tx.stockHistory.create({
        data: {
          productId: item.productId,
          type: "IN",
          quantity: item.quantity,
          stockBefore: updatedProduct.currentStock - item.quantity,
          stockAfter: updatedProduct.currentStock,
          refId: id,
          refCode: receipt.code,
          createdById: userId,
        },
      });
    }
  });

  emitStockUpdated(receipt.items.map((i) => i.productId));
  emitInboundApproved({
    id,
    code: receipt.code,
    status: "APPROVED",
    approvedById: userId,
  });

  await logActivity({
    userId,
    action: "inbound.approve",
    targetType: "GoodsReceipt",
    targetId: id,
    targetCode: receipt.code,
    detail: { itemCount: receipt.items.length },
  });

  return getInboundById(id);
}

export async function rejectInbound(
  id: string,
  reason: string,
  userId: string,
) {
  const receipt = await prisma.goodsReceipt.findUnique({
    where: { id },
    select: { id: true, status: true, code: true },
  });
  if (!receipt) {
    throw new AppError("NOT_FOUND", "Phiếu nhập không tồn tại");
  }
  if (receipt.status !== "PENDING") {
    throw new AppError("CONFLICT", "Phiếu đã được xử lý");
  }

  await prisma.goodsReceipt.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedById: userId,
      rejectedReason: reason,
    },
  });

  emitInboundRejected({
    id,
    code: receipt.code,
    status: "REJECTED",
    rejectedReason: reason,
  });

  await logActivity({
    userId,
    action: "inbound.reject",
    targetType: "GoodsReceipt",
    targetId: id,
    targetCode: receipt.code,
    detail: { reason },
  });

  return getInboundById(id);
}

// ─────────────────────────────────────────
// Export Excel
// ─────────────────────────────────────────

export async function exportInbounds(query: GetInboundsQuerySchemaInput) {
  // Bỏ qua phân trang — export toàn bộ theo filter
  const { search, status, supplierId, from, to } = query;

  const where: Prisma.GoodsReceiptWhereInput = {
    ...(status && { status }),
    ...(supplierId && { supplierId }),
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
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

  return prisma.goodsReceipt.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      supplier: { select: { id: true, name: true, taxCode: true } },
      createdBy: { select: { id: true, name: true } },
      items: {
        include: {
          product: { select: { sku: true, name: true, unit: true } },
        },
      },
    },
  });
}
