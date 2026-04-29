import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { AppError } from '../lib/errors'
import type {
  CreateUserSchemaInput,
  GetUsersQuerySchemaInput,
  UpdateUserSchemaInput,
} from '@wms/validations'

const BCRYPT_ROUNDS = 12

const userSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  isActive: true,
  roleId: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { id: true, name: true } },
} satisfies Prisma.UserSelect

export async function getUsers(query: GetUsersQuerySchemaInput) {
  const { page, limit, search, roleId, isActive } = query

  const where: Prisma.UserWhereInput = {
    ...(roleId && { roleId }),
    ...(typeof isActive === 'boolean' && { isActive }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ])

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  })
  if (!user) throw new AppError('NOT_FOUND', 'Người dùng không tồn tại')
  return user
}

export async function createUser(input: CreateUserSchemaInput) {
  const role = await prisma.role.findUnique({ where: { id: input.roleId } })
  if (!role) throw new AppError('VALIDATION_ERROR', 'Vai trò không tồn tại')

  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw new AppError('CONFLICT', 'Email đã được sử dụng')

  const hashed = await bcrypt.hash(input.password, BCRYPT_ROUNDS)
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashed,
      roleId: input.roleId,
    },
    select: userSelect,
  })
}

export async function updateUser(
  id: string,
  input: UpdateUserSchemaInput,
  actorId: string,
) {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('NOT_FOUND', 'Người dùng không tồn tại')

  if (input.email && input.email !== user.email) {
    const dup = await prisma.user.findUnique({ where: { email: input.email } })
    if (dup) throw new AppError('CONFLICT', 'Email đã được sử dụng')
  }

  if (input.roleId && input.roleId !== user.roleId) {
    const role = await prisma.role.findUnique({ where: { id: input.roleId } })
    if (!role) throw new AppError('VALIDATION_ERROR', 'Vai trò không tồn tại')
  }

  if (input.isActive === false && id === actorId) {
    throw new AppError('FORBIDDEN', 'Không thể tự khóa tài khoản của bạn')
  }

  const data: Prisma.UserUpdateInput = {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.email !== undefined && { email: input.email }),
    ...(input.roleId !== undefined && { role: { connect: { id: input.roleId } } }),
    ...(input.isActive !== undefined && { isActive: input.isActive }),
    ...(input.password && {
      password: await bcrypt.hash(input.password, BCRYPT_ROUNDS),
    }),
  }

  return prisma.user.update({ where: { id }, data, select: userSelect })
}

export async function toggleUserActive(
  id: string,
  isActive: boolean,
  actorId: string,
) {
  if (id === actorId) {
    throw new AppError('FORBIDDEN', 'Không thể tự khóa tài khoản của bạn')
  }
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new AppError('NOT_FOUND', 'Người dùng không tồn tại')

  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: userSelect,
  })
}

export async function deleteUser(id: string, actorId: string) {
  if (id === actorId) {
    throw new AppError('FORBIDDEN', 'Không thể xóa tài khoản của bạn')
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: { role: true },
  })
  if (!user) throw new AppError('NOT_FOUND', 'Người dùng không tồn tại')

  // Chặn xóa admin cuối cùng
  if (user.role.name === 'ADMIN') {
    const adminCount = await prisma.user.count({
      where: { role: { name: 'ADMIN' }, isActive: true },
    })
    if (adminCount <= 1) {
      throw new AppError(
        'CONFLICT',
        'Không thể xóa quản trị viên cuối cùng của hệ thống',
      )
    }
  }

  await prisma.user.delete({ where: { id } })
}
