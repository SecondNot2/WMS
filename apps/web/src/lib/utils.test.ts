import { describe, it, expect } from "vitest";
import { cn, isSafeImageUrl } from "./utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("dedupes conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm text-base")).toBe("text-base");
  });

  it("returns empty string for no input", () => {
    expect(cn()).toBe("");
  });

  it("flattens arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });
});

describe("isSafeImageUrl()", () => {
  it.each([
    ["https://example.com/a.png", true],
    ["http://example.com/a.png", true],
    ["blob:https://example.com/abc-123", true],
    ["data:image/png;base64,iVBORw0KGgo=", true],
    ["data:image/svg+xml;utf8,<svg/>", true],
    ["/uploads/avatar.jpg", true],
  ])("accepts safe URL %s", (url, expected) => {
    expect(isSafeImageUrl(url)).toBe(expected);
  });

  it.each([
    ["javascript:alert(1)", false],
    ["JavaScript:alert(1)", false],
    ["data:text/html,<script>alert(1)</script>", false],
    ["data:application/javascript,alert(1)", false],
    ["vbscript:msgbox(1)", false],
    ["file:///etc/passwd", false],
    ["//evil.com/x.png", false],
    ["", false],
    [null, false],
    [undefined, false],
  ])("rejects unsafe URL %s", (url, expected) => {
    expect(isSafeImageUrl(url as string | null | undefined)).toBe(expected);
  });
});
