import { describe, it, expect } from "vitest";
import {
  can,
  rolesAllowedFor,
  formatAllowedRoles,
  labelOfRole,
  ROLE_LABELS,
} from "./permissions";

describe("labelOfRole()", () => {
  it("returns Vietnamese label for known role", () => {
    expect(labelOfRole("ADMIN")).toBe("Quản trị viên");
    expect(labelOfRole("WAREHOUSE_STAFF")).toBe("Thủ kho");
    expect(labelOfRole("ACCOUNTANT")).toBe("Kế toán");
  });

  it("returns the input itself for unknown role", () => {
    expect(labelOfRole("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("ROLE_LABELS", () => {
  it("has all 3 expected core roles", () => {
    expect(Object.keys(ROLE_LABELS)).toEqual(
      expect.arrayContaining(["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"]),
    );
  });
});

describe("can()", () => {
  it("allows ADMIN for every action", () => {
    expect(can("ADMIN", "product.delete")).toBe(true);
    expect(can("ADMIN", "user.create")).toBe(true);
    expect(can("ADMIN", "role.delete")).toBe(true);
    expect(can("ADMIN", "activityLog.view")).toBe(true);
  });

  it("allows WAREHOUSE_STAFF for warehouse operations", () => {
    expect(can("WAREHOUSE_STAFF", "product.create")).toBe(true);
    expect(can("WAREHOUSE_STAFF", "receipt.approve")).toBe(true);
    expect(can("WAREHOUSE_STAFF", "stock.adjust")).toBe(true);
  });

  it("denies WAREHOUSE_STAFF for admin-only actions", () => {
    expect(can("WAREHOUSE_STAFF", "product.delete")).toBe(false);
    expect(can("WAREHOUSE_STAFF", "user.view")).toBe(false);
    expect(can("WAREHOUSE_STAFF", "role.create")).toBe(false);
  });

  it("allows ACCOUNTANT to view but not mutate", () => {
    expect(can("ACCOUNTANT", "report.view")).toBe(true);
    expect(can("ACCOUNTANT", "report.export")).toBe(true);
    expect(can("ACCOUNTANT", "product.view")).toBe(true);

    expect(can("ACCOUNTANT", "product.create")).toBe(false);
    expect(can("ACCOUNTANT", "receipt.approve")).toBe(false);
    expect(can("ACCOUNTANT", "stock.adjust")).toBe(false);
  });

  it("denies when role is null/undefined", () => {
    expect(can(null, "product.view")).toBe(false);
    expect(can(undefined, "product.view")).toBe(false);
  });
});

describe("rolesAllowedFor()", () => {
  it("returns full role list for shared view actions", () => {
    expect(rolesAllowedFor("product.view")).toEqual([
      "ADMIN",
      "WAREHOUSE_STAFF",
      "ACCOUNTANT",
    ]);
  });

  it("returns only ADMIN for admin-only actions", () => {
    expect(rolesAllowedFor("user.delete")).toEqual(["ADMIN"]);
    expect(rolesAllowedFor("role.create")).toEqual(["ADMIN"]);
  });
});

describe("formatAllowedRoles()", () => {
  it("formats roles into Vietnamese comma-separated string", () => {
    expect(formatAllowedRoles("user.create")).toBe("Quản trị viên");
    expect(formatAllowedRoles("product.create")).toBe("Quản trị viên, Thủ kho");
    expect(formatAllowedRoles("report.view")).toBe(
      "Quản trị viên, Thủ kho, Kế toán",
    );
  });
});
