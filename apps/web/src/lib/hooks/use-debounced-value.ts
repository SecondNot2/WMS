"use client";

import React from "react";

/**
 * Trả về giá trị được debounce sau `delayMs` mili-giây.
 * Dùng khi cần gọi API search theo input của user.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
