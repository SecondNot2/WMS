import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import type { Prisma } from "@prisma/client";
import type { AuthUser, LoginResponse, RefreshResponse } from "@wms/types";
import type {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  UpdateProfileInput,
} from "@wms/validations";

const BCRYPT_ROUNDS = 12;

function toAuthUser(user: {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: { name: string; permissions: Prisma.JsonValue };
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role.name as AuthUser["role"],
    permissions: (user.role.permissions ?? {}) as AuthUser["permissions"],
  };
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new AppError("UNAUTHORIZED", "Email hoặc mật khẩu không đúng");
  }

  const ok = await bcrypt.compare(input.password, user.password);
  if (!ok) {
    throw new AppError("UNAUTHORIZED", "Email hoặc mật khẩu không đúng");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role.name });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role.name });

  return { user: toAuthUser(user), accessToken, refreshToken };
}

export async function refresh(
  input: RefreshTokenInput,
): Promise<RefreshResponse> {
  const payload = verifyRefreshToken(input.refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new AppError("UNAUTHORIZED", "Tài khoản không khả dụng");
  }

  const accessToken = signAccessToken({ sub: user.id, role: user.role.name });
  return { accessToken };
}

export async function getMe(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new AppError("UNAUTHORIZED", "Tài khoản không tồn tại");
  }

  return toAuthUser(user);
}

export async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("UNAUTHORIZED", "Tài khoản không tồn tại");

  const ok = await bcrypt.compare(input.currentPassword, user.password);
  if (!ok) {
    throw new AppError("UNAUTHORIZED", "Mật khẩu hiện tại không đúng");
  }

  const hashed = await bcrypt.hash(input.newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("UNAUTHORIZED", "Tài khoản không tồn tại");

  if (input.email && input.email !== user.email) {
    const dup = await prisma.user.findUnique({ where: { email: input.email } });
    if (dup) throw new AppError("CONFLICT", "Email đã được sử dụng");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.avatar !== undefined && { avatar: input.avatar }),
    },
    include: { role: true },
  });

  return toAuthUser(updated);
}
