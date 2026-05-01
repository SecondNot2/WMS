import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { AppError } from "../lib/errors";

// Mock prisma client BEFORE importing the service under test.
vi.mock("../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { prisma } from "../lib/prisma";
import { login, refresh, getMe, changePassword } from "./auth.service";
import { signRefreshToken } from "../lib/jwt";

const mockedFindUnique = prisma.user.findUnique as unknown as ReturnType<
  typeof vi.fn
>;
const mockedUpdate = prisma.user.update as unknown as ReturnType<typeof vi.fn>;

const baseUser = {
  id: "user-1",
  name: "Nguyễn Văn A",
  email: "admin@wms.test",
  avatar: null,
  isActive: true,
  password: "", // filled per test
  role: { name: "ADMIN", permissions: { "*": ["*"] } },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.service / login", () => {
  it("returns user + tokens on valid credentials", async () => {
    const password = "Secret123!";
    const user = { ...baseUser, password: await bcrypt.hash(password, 4) };
    mockedFindUnique.mockResolvedValue(user);

    const result = await login({ email: user.email, password });

    expect(result.user).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: null,
      role: "ADMIN",
      permissions: { "*": ["*"] },
    });
    expect(result.accessToken).toBeTypeOf("string");
    expect(result.refreshToken).toBeTypeOf("string");
  });

  it("rejects unknown email with UNAUTHORIZED", async () => {
    mockedFindUnique.mockResolvedValue(null);

    await expect(
      login({ email: "ghost@wms.test", password: "any" }),
    ).rejects.toThrow(AppError);
    await expect(
      login({ email: "ghost@wms.test", password: "any" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects deactivated account", async () => {
    mockedFindUnique.mockResolvedValue({ ...baseUser, isActive: false });

    await expect(
      login({ email: baseUser.email, password: "any" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects wrong password", async () => {
    const user = { ...baseUser, password: await bcrypt.hash("correct", 4) };
    mockedFindUnique.mockResolvedValue(user);

    await expect(
      login({ email: user.email, password: "wrong" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("auth.service / refresh", () => {
  it("issues new access token from valid refresh token", async () => {
    mockedFindUnique.mockResolvedValue(baseUser);
    const refreshToken = signRefreshToken({
      sub: baseUser.id,
      role: "ADMIN",
    });

    const result = await refresh({ refreshToken });
    expect(result.accessToken).toBeTypeOf("string");
  });

  it("rejects deactivated user even with valid refresh token", async () => {
    mockedFindUnique.mockResolvedValue({ ...baseUser, isActive: false });
    const refreshToken = signRefreshToken({
      sub: baseUser.id,
      role: "ADMIN",
    });

    await expect(refresh({ refreshToken })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("rejects malformed refresh token", async () => {
    await expect(refresh({ refreshToken: "not-a-jwt" })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});

describe("auth.service / getMe", () => {
  it("returns current user when active", async () => {
    mockedFindUnique.mockResolvedValue(baseUser);
    const result = await getMe(baseUser.id);
    expect(result.id).toBe(baseUser.id);
    expect(result.role).toBe("ADMIN");
  });

  it("rejects when user missing", async () => {
    mockedFindUnique.mockResolvedValue(null);
    await expect(getMe("missing")).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});

describe("auth.service / changePassword", () => {
  it("hashes and persists new password when current password matches", async () => {
    const current = "OldPass123!";
    const user = { ...baseUser, password: await bcrypt.hash(current, 4) };
    mockedFindUnique.mockResolvedValue(user);
    mockedUpdate.mockResolvedValue(user);

    await changePassword(user.id, {
      currentPassword: current,
      newPassword: "NewPass456!",
    });

    expect(mockedUpdate).toHaveBeenCalledOnce();
    const updateCall = mockedUpdate.mock.calls[0]![0] as {
      data: { password: string };
    };
    // New password is hashed (not stored plaintext)
    expect(updateCall.data.password).not.toBe("NewPass456!");
    expect(await bcrypt.compare("NewPass456!", updateCall.data.password)).toBe(
      true,
    );
  });

  it("rejects when current password is wrong", async () => {
    const user = { ...baseUser, password: await bcrypt.hash("right", 4) };
    mockedFindUnique.mockResolvedValue(user);

    await expect(
      changePassword(user.id, {
        currentPassword: "wrong",
        newPassword: "any",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});
