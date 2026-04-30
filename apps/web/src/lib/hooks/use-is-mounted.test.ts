import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMounted } from "./use-is-mounted";

describe("useIsMounted()", () => {
  it("returns true after mount on client", () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current).toBe(true);
  });
});
