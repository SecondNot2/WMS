// Shared constants & enums.

export const ROLES = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] as const;
export type Role = (typeof ROLES)[number];

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const STOCK_TRANSACTION_TYPES = ["IN", "OUT", "ADJUST"] as const;
export type StockTransactionType = (typeof STOCK_TRANSACTION_TYPES)[number];
