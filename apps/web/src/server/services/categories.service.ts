import { Prisma } from "@prisma/client";
import * as XLSX from "xlsx";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import type {
  CreateCategorySchemaInput,
  GetCategoriesQuerySchemaInput,
  UpdateCategorySchemaInput,
} from "@wms/validations";

const productSummarySelect = {
  id: true,
  sku: true,
  name: true,
  unit: true,
  currentStock: true,
} satisfies Prisma.ProductSelect;

function normalizeNullable(value: string | null | undefined) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function categoryData(
  input: CreateCategorySchemaInput | UpdateCategorySchemaInput,
) {
  return {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && {
      description: normalizeNullable(input.description),
    }),
    ...("isActive" in input &&
      input.isActive !== undefined && { isActive: input.isActive }),
  } satisfies Prisma.CategoryCreateInput | Prisma.CategoryUpdateInput;
}

async function assertNameUnique(name: string, excludeId?: string) {
  const existing = await prisma.category.findFirst({
    where: {
      name,
      ...(excludeId && { NOT: { id: excludeId } }),
    },
    select: { id: true },
  });
  if (existing) throw new AppError("CONFLICT", "Tên danh mục đã tồn tại");
}

export async function getCategories(query: GetCategoriesQuerySchemaInput) {
  const { page, limit, search, isActive } = query;

  const where: Prisma.CategoryWhereInput = {
    ...(typeof isActive === "boolean" ? { isActive } : { isActive: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  const data = items.map(({ _count, ...rest }) => ({
    ...rest,
    productCount: _count.products,
  }));

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        where: { isActive: true },
        select: productSummarySelect,
        orderBy: { name: "asc" },
      },
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!category || !category.isActive) {
    throw new AppError("NOT_FOUND", "Danh mục không tồn tại");
  }

  const { _count, products, ...rest } = category;
  return { ...rest, productCount: _count.products, products };
}

export async function createCategory(input: CreateCategorySchemaInput) {
  await assertNameUnique(input.name);

  const created = await prisma.category.create({
    data: categoryData(input) as Prisma.CategoryCreateInput,
  });
  return { ...created, productCount: 0 };
}

export async function updateCategory(
  id: string,
  input: UpdateCategorySchemaInput,
) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || !category.isActive) {
    throw new AppError("NOT_FOUND", "Danh mục không tồn tại");
  }

  if (input.name && input.name !== category.name) {
    await assertNameUnique(input.name, id);
  }

  const updated = await prisma.category.update({
    where: { id },
    data: categoryData(input) as Prisma.CategoryUpdateInput,
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });

  const { _count, ...rest } = updated;
  return { ...rest, productCount: _count.products };
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
  if (!category || !category.isActive) {
    throw new AppError("NOT_FOUND", "Danh mục không tồn tại");
  }
  if (category._count.products > 0) {
    throw new AppError(
      "CONFLICT",
      "Không thể xóa: danh mục đang có sản phẩm hoạt động",
    );
  }

  await prisma.category.update({ where: { id }, data: { isActive: false } });
}

type CategoryImportRow = Record<string, unknown>;

function cellString(row: CategoryImportRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return undefined;
}

export async function importCategories(fileBuffer: Buffer) {
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName)
    throw new AppError("VALIDATION_ERROR", "File Excel không có dữ liệu");

  const rows = XLSX.utils.sheet_to_json<CategoryImportRow>(
    workbook.Sheets[sheetName],
    { defval: "" },
  );

  let imported = 0;
  let skipped = 0;
  const errors: { row: number; reason: string }[] = [];

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    try {
      const name = cellString(row, [
        "name",
        "Name",
        "Tên",
        "Ten",
        "Tên danh mục",
      ]);
      if (!name) {
        throw new Error("Thiếu tên danh mục");
      }
      const description = cellString(row, [
        "description",
        "Description",
        "Mô tả",
        "Mo ta",
      ]);

      await createCategory({ name, description: description ?? null });
      imported += 1;
    } catch (error) {
      skipped += 1;
      errors.push({
        row: rowNumber,
        reason: error instanceof Error ? error.message : "Dữ liệu không hợp lệ",
      });
    }
  }

  return { imported, skipped, errors };
}
