import "@testing-library/jest-dom/vitest";

// Default test env vars (shadowed by .env.test if present).
process.env.JWT_SECRET ??= "test-access-secret-min-32-chars-long";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-min-32-chars-long";
