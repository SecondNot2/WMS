import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import type {
  CreateRoleSchemaInput,
  UpdateRoleSchemaInput,
} from "@wms/validations";

export async function getRoles() {
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return roles.map((r) => ({
    id: r.id,
    name: r.name,
    permissions: (r.permissions ?? {}) as Record<string, string[]>,
    userCount: r._count.users,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function getRoleById(id: string) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true } },
      users: {
        select: { id: true, name: true, email: true, avatar: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!role) throw new AppError("NOT_FOUND", "Vai trò không tồn tại");

  return {
    id: role.id,
    name: role.name,
    permissions: (role.permissions ?? {}) as Record<string, string[]>,
    userCount: role._count.users,
    users: role.users,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

export async function createRole(input: CreateRoleSchemaInput) {
  const existing = await prisma.role.findUnique({
    where: { name: input.name },
  });
  if (existing) throw new AppError("CONFLICT", "Mã vai trò đã tồn tại");

  return prisma.role.create({
    data: {
      name: input.name,
      permissions: input.permissions as Prisma.InputJsonValue,
    },
  });
}

export async function updateRole(id: string, input: UpdateRoleSchemaInput) {
  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) throw new AppError("NOT_FOUND", "Vai trò không tồn tại");

  if (input.name && input.name !== role.name) {
    const dup = await prisma.role.findUnique({ where: { name: input.name } });
    if (dup) throw new AppError("CONFLICT", "Mã vai trò đã tồn tại");
  }

  return prisma.role.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.permissions !== undefined && {
        permissions: input.permissions as Prisma.InputJsonValue,
      }),
    },
  });
}

export async function deleteRole(id: string) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } },
  });
  if (!role) throw new AppError("NOT_FOUND", "Vai trò không tồn tại");

  if (role._count.users > 0) {
    throw new AppError(
      "CONFLICT",
      `Vai trò đang được gán cho ${role._count.users} người dùng, không thể xóa`,
    );
  }

  await prisma.role.delete({ where: { id } });
}
