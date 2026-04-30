import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "./jwt";
import { AppError } from "./errors";

const payload = { sub: "user-123", role: "ADMIN" };

describe("jwt", () => {
  describe("access token", () => {
    it("signs and verifies a valid access token", () => {
      const token = signAccessToken(payload);
      const decoded = verifyAccessToken(token);
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.role).toBe(payload.role);
    });

    it("throws AppError(UNAUTHORIZED) on tampered token", () => {
      const token = signAccessToken(payload) + "tampered";
      expect(() => verifyAccessToken(token)).toThrow(AppError);
      try {
        verifyAccessToken(token);
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe("UNAUTHORIZED");
      }
    });

    it("throws AppError on token signed with wrong secret", () => {
      const wrongToken = jwt.sign(payload, "different-secret");
      expect(() => verifyAccessToken(wrongToken)).toThrow(AppError);
    });

    it("throws AppError on expired token", () => {
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "-1s",
      });
      expect(() => verifyAccessToken(expiredToken)).toThrow(AppError);
    });
  });

  describe("refresh token", () => {
    it("signs and verifies a valid refresh token", () => {
      const token = signRefreshToken(payload);
      const decoded = verifyRefreshToken(token);
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.role).toBe(payload.role);
    });

    it("rejects access token when used as refresh token", () => {
      const access = signAccessToken(payload);
      // Different secrets — verifyRefreshToken should fail
      expect(() => verifyRefreshToken(access)).toThrow(AppError);
    });

    it("rejects refresh token when used as access token", () => {
      const refresh = signRefreshToken(payload);
      expect(() => verifyAccessToken(refresh)).toThrow(AppError);
    });
  });
});
