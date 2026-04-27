import { Prisma } from '@prisma/client'
import * as XLSX from 'xlsx'
import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type {
  AdjustStockSchemaInput,
  CreateProductSchemaInput,
  GetProductsQuerySchemaInput,
  UpdateProductSchemaInput,
} from '@wms/validations'

const productInclude = {
  category: { select: { id: true, name: true } },
} satisfies Prisma.ProductInclude

const stockHistorySelect = {
  id: true,
  productId: true,
  type: true,
  quantity: true,
  stockBefore: true,
  stockAfter: true,
  refId: true,
  refCode: true,
  note: true,
  createdById: true,
  createdAt: true,
} satisfies Prisma.StockHistorySelect

function normalizeNullable(value: string | null | undefined) {
  if (typeof value !== 'string') return value ?? null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function productData(input: CreateProductSchemaInput | UpdateProductSchemaInput) {
  return {
    ...(input.sku !== undefined && { sku: input.sku }),
    ...(input.barcode !== undefined && { barcode: normalizeNullable(input.barcode) }),
    ...(input.name !== undefined && { name: input.name }),
    ...(input.brand !== undefined && { brand: normalizeNullable(input.brand) }),
    ...(input.model !== undefined && { model: normalizeNullable(input.model) }),
    ...(input.description !== undefined && {
      description: normalizeNullable(input.description),
    }),
    ...(input.image !== undefined && { image: normalizeNullable(input.image) }),
    ...(input.unit !== undefined && { unit: input.unit }),
    ...(input.categoryId !== undefined && {
      category: { connect: { id: input.categoryId } },
    }),
    ...(input.minStock !== undefined && { minStock: input.minStock }),
    ...(input.costPrice !== undefined && { costPrice: input.costPrice }),
    ...(input.salePrice !== undefined && { salePrice: input.salePrice }),
    ...(input.taxRate !== undefined && { taxRate: input.taxRate }),
    ...(input.location !== undefined && { location: normalizeNullable(input.location) }),
    ...('isActive' in input && input.isActive !== undefined && { isActive: input.isActive }),
  } satisfies Prisma.ProductCreateInput | Prisma.ProductUpdateInput
}

async function assertCategoryExists(categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, isActive: true },
    select: { id: true },
  })
  if (!category) throw new AppError('VALIDATION_ERROR', 'Danh mục không tồn tại')
}

async function assertProductUnique(input: {
  sku?: string
  barcode?: string | null
  excludeId?: string
}) {
  const barcode = normalizeNullable(input.barcode)
  const or: Prisma.ProductWhereInput[] = []
  if (input.sku) or.push({ sku: input.sku })
  if (barcode) or.push({ barcode })
  if (or.length === 0) return

  const existing = await prisma.product.findFirst({
    where: {
      OR: or,
      ...(input.excludeId && { NOT: { id: input.excludeId } }),
    },
    select: { sku: true, barcode: true },
  })

  if (!existing) return
  if (input.sku && existing.sku === input.sku) {
    throw new AppError('CONFLICT', 'Mã SKU đã tồn tại')
  }
  throw new AppError('CONFLICT', 'Mã vạch đã tồn tại')
}

export async function getProducts(query: GetProductsQuerySchemaInput) {
  const { page, limit, search, categoryId, isActive, lowStock } = query

  const where: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
    ...(typeof isActive === 'boolean' ? { isActive } : { isActive: true }),
    ...(lowStock && { currentStock: { lte: prisma.product.fields.minStock } }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  }
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ...productInclude,
      stockHistories: {
        select: stockHistorySelect,
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })
  if (!product || !product.isActive) {
    throw new AppError('NOT_FOUND', 'Sản phẩm không tồn tại')
  }

  const { stockHistories, ...rest } = product
  return { ...rest, recentStockHistory: stockHistories }
}

export async function createProduct(input: CreateProductSchemaInput) {
  await assertCategoryExists(input.categoryId)
  await assertProductUnique({ sku: input.sku, barcode: input.barcode })

  return prisma.product.create({
    data: productData(input) as Prisma.ProductCreateInput,
    include: productInclude,
  })
}

export async function updateProduct(id: string, input: UpdateProductSchemaInput) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product || !product.isActive) {
    throw new AppError('NOT_FOUND', 'Sản phẩm không tồn tại')
  }

  if (input.categoryId) await assertCategoryExists(input.categoryId)
  await assertProductUnique({
    sku: input.sku,
    barcode: input.barcode,
    excludeId: id,
  })

  return prisma.product.update({
    where: { id },
    data: productData(input) as Prisma.ProductUpdateInput,
    include: productInclude,
  })
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product || !product.isActive) {
    throw new AppError('NOT_FOUND', 'Sản phẩm không tồn tại')
  }

  await prisma.product.update({ where: { id }, data: { isActive: false } })
}

export async function getProductStockHistory(id: string, limit = 20) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, isActive: true },
  })
  if (!product || !product.isActive) {
    throw new AppError('NOT_FOUND', 'Sản phẩm không tồn tại')
  }

  return prisma.stockHistory.findMany({
    where: { productId: id },
    select: stockHistorySelect,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
}

export async function adjustStock(
  id: string,
  input: AdjustStockSchemaInput,
  actorId: string,
) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product || !product.isActive) {
    throw new AppError('NOT_FOUND', 'Sản phẩm không tồn tại')
  }

  const stockAfter = product.currentStock + input.quantity
  if (stockAfter < 0) {
    throw new AppError('INSUFFICIENT_STOCK', 'Tồn kho không đủ để điều chỉnh')
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id },
      data: { currentStock: stockAfter },
      include: productInclude,
    })

    await tx.stockHistory.create({
      data: {
        productId: id,
        type: 'ADJUST',
        quantity: input.quantity,
        stockBefore: product.currentStock,
        stockAfter,
        note: input.note,
        createdById: actorId,
      },
    })

    return updated
  })
}

type ProductImportRow = Record<string, unknown>

function cellString(row: ProductImportRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value).trim()
    }
  }
  return undefined
}

function cellNumber(row: ProductImportRow, keys: string[]) {
  const value = cellString(row, keys)
  if (value === undefined) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

export async function importProducts(fileBuffer: Buffer) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) throw new AppError('VALIDATION_ERROR', 'File Excel không có dữ liệu')

  const rows = XLSX.utils.sheet_to_json<ProductImportRow>(workbook.Sheets[sheetName], {
    defval: '',
  })

  let imported = 0
  let skipped = 0
  const errors: { row: number; reason: string }[] = []

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2
    try {
      const input: CreateProductSchemaInput = {
        sku: cellString(row, ['sku', 'SKU', 'Mã SKU', 'Ma SKU']) ?? '',
        barcode: cellString(row, ['barcode', 'Barcode', 'Mã vạch', 'Ma vach']) ?? null,
        name: cellString(row, ['name', 'Name', 'Tên sản phẩm', 'Ten san pham']) ?? '',
        brand: cellString(row, ['brand', 'Brand', 'Thương hiệu', 'Thuong hieu']) ?? null,
        model: cellString(row, ['model', 'Model']) ?? null,
        description: cellString(row, ['description', 'Description', 'Mô tả', 'Mo ta']) ?? null,
        image: cellString(row, ['image', 'Image', 'Ảnh', 'Anh']) ?? null,
        unit: cellString(row, ['unit', 'Unit', 'Đơn vị', 'Don vi']) ?? '',
        categoryId: cellString(row, ['categoryId', 'Category ID', 'Mã danh mục', 'Ma danh muc']) ?? '',
        minStock: cellNumber(row, ['minStock', 'Min stock', 'Tồn tối thiểu', 'Ton toi thieu']) ?? 0,
        costPrice: cellNumber(row, ['costPrice', 'Cost price', 'Giá vốn', 'Gia von']) ?? null,
        salePrice: cellNumber(row, ['salePrice', 'Sale price', 'Giá bán', 'Gia ban']) ?? null,
        taxRate: cellNumber(row, ['taxRate', 'Tax rate', 'Thuế suất', 'Thue suat']) ?? null,
        location: cellString(row, ['location', 'Location', 'Vị trí', 'Vi tri']) ?? null,
      }

      await createProduct(input)
      imported += 1
    } catch (error) {
      skipped += 1
      errors.push({
        row: rowNumber,
        reason: error instanceof Error ? error.message : 'Dữ liệu không hợp lệ',
      })
    }
  }

  return { imported, skipped, errors }
}
