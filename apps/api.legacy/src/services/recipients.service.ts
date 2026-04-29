import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { logActivity } from "../lib/activityLog";
import type {
  CreateRecipientSchemaInput,
  GetRecipientsQuerySchemaInput,
  UpdateRecipientSchemaInput,
} from "@wms/validations";

function normalizeNullable(value: string | null | undefined) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function recipientData(
  input: CreateRecipientSchemaInput | UpdateRecipientSchemaInput,
) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.phone !== undefined && { phone: normalizeNullable(input.phone) }),
    ...(input.email !== undefined && { email: normalizeNullable(input.email) }),
    ...(input.address !== undefined && {
      address: normalizeNullable(input.address),
    }),
    ...("isActive" in input &&
      input.isActive !== undefined && { isActive: input.isActive }),
  } satisfies Prisma.RecipientCreateInput | Prisma.RecipientUpdateInput;
}

export async function getRecipients(query: GetRecipientsQuerySchemaInput) {
  const { page, limit, search, isActive } = query;

  const where: Prisma.RecipientWhereInput = {
    ...(typeof isActive === "boolean" ? { isActive } : { isActive: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.recipient.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { goodsIssues: true } },
      },
    }),
    prisma.recipient.count({ where }),
  ]);

  const ids = items.map((r) => r.id);
  const aggregates = ids.length
    ? await prisma.goodsIssue.groupBy({
        by: ["recipientId"],
        where: { recipientId: { in: ids }, status: "APPROVED" },
        _sum: { totalAmount: true },
      })
    : [];

  const totalAmountMap = new Map(
    aggregates.map((a) => [a.recipientId, Number(a._sum.totalAmount ?? 0)]),
  );

  const data = items.map(({ _count, ...rest }) => ({
    ...rest,
    outboundCount: _count.goodsIssues,
    totalAmount: totalAmountMap.get(rest.id) ?? 0,
  }));

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getRecipientById(id: string) {
  const recipient = await prisma.recipient.findUnique({
    where: { id },
    include: {
      _count: { select: { goodsIssues: true } },
    },
  });
  if (!recipient || !recipient.isActive) {
    throw new AppError("NOT_FOUND", "Đơn vị nhận không tồn tại");
  }

  const [aggregate, recentOutbounds] = await Promise.all([
    prisma.goodsIssue.aggregate({
      where: { recipientId: id, status: "APPROVED" },
      _sum: { totalAmount: true },
    }),
    prisma.goodsIssue.findMany({
      where: { recipientId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        code: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),
  ]);

  const totalAmount = Number(aggregate._sum.totalAmount ?? 0);

  const { _count, ...rest } = recipient;
  return {
    ...rest,
    outboundCount: _count.goodsIssues,
    totalAmount,
    stats: { totalOutbound: _count.goodsIssues, totalAmount },
    recentOutbounds: recentOutbounds.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
    })),
  };
}

export async function createRecipient(
  input: CreateRecipientSchemaInput,
  userId: string,
) {
  const created = await prisma.recipient.create({
    data: recipientData(input) as Prisma.RecipientCreateInput,
  });

  await logActivity({
    userId,
    action: "recipient.create",
    targetType: "Recipient",
    targetId: created.id,
    targetCode: created.name,
  });

  return { ...created, outboundCount: 0, totalAmount: 0 };
}

export async function updateRecipient(
  id: string,
  input: UpdateRecipientSchemaInput,
  userId: string,
) {
  const recipient = await prisma.recipient.findUnique({ where: { id } });
  if (!recipient || !recipient.isActive) {
    throw new AppError("NOT_FOUND", "Đơn vị nhận không tồn tại");
  }

  const updated = await prisma.recipient.update({
    where: { id },
    data: recipientData(input) as Prisma.RecipientUpdateInput,
    include: { _count: { select: { goodsIssues: true } } },
  });

  const aggregate = await prisma.goodsIssue.aggregate({
    where: { recipientId: id, status: "APPROVED" },
    _sum: { totalAmount: true },
  });

  const { _count, ...rest } = updated;

  await logActivity({
    userId,
    action: "recipient.update",
    targetType: "Recipient",
    targetId: updated.id,
    targetCode: updated.name,
  });

  return {
    ...rest,
    outboundCount: _count.goodsIssues,
    totalAmount: Number(aggregate._sum.totalAmount ?? 0),
  };
}

export async function deleteRecipient(id: string, userId: string) {
  const recipient = await prisma.recipient.findUnique({ where: { id } });
  if (!recipient || !recipient.isActive) {
    throw new AppError("NOT_FOUND", "Đơn vị nhận không tồn tại");
  }

  await prisma.recipient.update({
    where: { id },
    data: { isActive: false },
  });

  await logActivity({
    userId,
    action: "recipient.delete",
    targetType: "Recipient",
    targetId: recipient.id,
    targetCode: recipient.name,
  });
}
