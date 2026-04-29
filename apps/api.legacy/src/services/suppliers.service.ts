import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { logActivity } from "../lib/activityLog";
import type {
  CreateSupplierSchemaInput,
  GetSuppliersQuerySchemaInput,
  UpdateSupplierSchemaInput,
} from "@wms/validations";

function normalizeNullable(value: string | null | undefined) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function supplierData(
  input: CreateSupplierSchemaInput | UpdateSupplierSchemaInput,
) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.phone !== undefined && { phone: normalizeNullable(input.phone) }),
    ...(input.email !== undefined && { email: normalizeNullable(input.email) }),
    ...(input.address !== undefined && {
      address: normalizeNullable(input.address),
    }),
    ...(input.taxCode !== undefined && {
      taxCode: normalizeNullable(input.taxCode),
    }),
    ...("isActive" in input &&
      input.isActive !== undefined && { isActive: input.isActive }),
  } satisfies Prisma.SupplierCreateInput | Prisma.SupplierUpdateInput;
}

async function assertTaxCodeUnique(taxCode: string, excludeId?: string) {
  const existing = await prisma.supplier.findFirst({
    where: {
      taxCode,
      isActive: true,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
    select: { id: true },
  });
  if (existing) throw new AppError("CONFLICT", "Mã số thuế đã tồn tại");
}

export async function getSuppliers(query: GetSuppliersQuerySchemaInput) {
  const { page, limit, search, isActive } = query;

  const where: Prisma.SupplierWhereInput = {
    ...(typeof isActive === "boolean" ? { isActive } : { isActive: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { taxCode: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { goodsReceipts: true } },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  // Aggregate totalAmount của các phiếu APPROVED cho từng supplier
  const ids = items.map((s) => s.id);
  const aggregates = ids.length
    ? await prisma.goodsReceipt.groupBy({
        by: ["supplierId"],
        where: { supplierId: { in: ids }, status: "APPROVED" },
        _sum: { totalAmount: true },
      })
    : [];

  const totalAmountMap = new Map(
    aggregates.map((a) => [a.supplierId, Number(a._sum.totalAmount ?? 0)]),
  );

  const data = items.map(({ _count, ...rest }) => ({
    ...rest,
    inboundCount: _count.goodsReceipts,
    totalAmount: totalAmountMap.get(rest.id) ?? 0,
  }));

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getSupplierById(id: string) {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: { select: { goodsReceipts: true } },
    },
  });
  if (!supplier || !supplier.isActive) {
    throw new AppError("NOT_FOUND", "Nhà cung cấp không tồn tại");
  }

  const [aggregate, recentInbounds] = await Promise.all([
    prisma.goodsReceipt.aggregate({
      where: { supplierId: id, status: "APPROVED" },
      _sum: { totalAmount: true },
    }),
    prisma.goodsReceipt.findMany({
      where: { supplierId: id },
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

  const { _count, ...rest } = supplier;
  return {
    ...rest,
    inboundCount: _count.goodsReceipts,
    totalAmount,
    stats: { totalInbound: _count.goodsReceipts, totalAmount },
    recentInbounds,
  };
}

export async function createSupplier(
  input: CreateSupplierSchemaInput,
  userId: string,
) {
  const taxCode = normalizeNullable(input.taxCode);
  if (taxCode) await assertTaxCodeUnique(taxCode);

  const created = await prisma.supplier.create({
    data: supplierData(input) as Prisma.SupplierCreateInput,
  });

  await logActivity({
    userId,
    action: "supplier.create",
    targetType: "Supplier",
    targetId: created.id,
    targetCode: created.name,
  });

  return { ...created, inboundCount: 0, totalAmount: 0 };
}

export async function updateSupplier(
  id: string,
  input: UpdateSupplierSchemaInput,
  userId: string,
) {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier || !supplier.isActive) {
    throw new AppError("NOT_FOUND", "Nhà cung cấp không tồn tại");
  }

  if (input.taxCode !== undefined) {
    const taxCode = normalizeNullable(input.taxCode);
    if (taxCode && taxCode !== supplier.taxCode) {
      await assertTaxCodeUnique(taxCode, id);
    }
  }

  const updated = await prisma.supplier.update({
    where: { id },
    data: supplierData(input) as Prisma.SupplierUpdateInput,
    include: { _count: { select: { goodsReceipts: true } } },
  });

  const aggregate = await prisma.goodsReceipt.aggregate({
    where: { supplierId: id, status: "APPROVED" },
    _sum: { totalAmount: true },
  });

  const { _count, ...rest } = updated;

  await logActivity({
    userId,
    action: "supplier.update",
    targetType: "Supplier",
    targetId: updated.id,
    targetCode: updated.name,
  });

  return {
    ...rest,
    inboundCount: _count.goodsReceipts,
    totalAmount: Number(aggregate._sum.totalAmount ?? 0),
  };
}

export async function deleteSupplier(id: string, userId: string) {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier || !supplier.isActive) {
    throw new AppError("NOT_FOUND", "Nhà cung cấp không tồn tại");
  }

  await prisma.supplier.update({
    where: { id },
    data: { isActive: false },
  });

  await logActivity({
    userId,
    action: "supplier.delete",
    targetType: "Supplier",
    targetId: supplier.id,
    targetCode: supplier.name,
  });
}
