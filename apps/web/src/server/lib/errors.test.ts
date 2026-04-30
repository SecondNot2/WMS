import { describe, it, expect } from "vitest";
import { AppError, type ErrorCode } from "./errors";

describe("AppError", () => {
  it("preserves code and message", () => {
    const err = new AppError("NOT_FOUND", "Sản phẩm không tồn tại");
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toBe("Sản phẩm không tồn tại");
    expect(err.name).toBe("AppError");
  });

  it("is an instance of Error", () => {
    const err = new AppError("CONFLICT", "Duplicate");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);
  });

  it.each<[ErrorCode, number]>([
    ["UNAUTHORIZED", 401],
    ["FORBIDDEN", 403],
    ["NOT_FOUND", 404],
    ["VALIDATION_ERROR", 422],
    ["CONFLICT", 409],
    ["INSUFFICIENT_STOCK", 400],
    ["INTERNAL_ERROR", 500],
  ])("maps %s to HTTP %i by default", (code, expectedStatus) => {
    const err = new AppError(code, "msg");
    expect(err.statusCode).toBe(expectedStatus);
  });

  it("allows overriding statusCode explicitly", () => {
    const err = new AppError("VALIDATION_ERROR", "Bad input", 400);
    expect(err.statusCode).toBe(400);
  });
});
