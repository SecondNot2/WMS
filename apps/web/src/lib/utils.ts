import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Whitelist URL schemes that are safe to use as `<img src>`.
 * Blocks `javascript:`, `data:text/html`, and other script-capable schemes
 * to prevent XSS via DOM-derived URLs (CodeQL rule js/xss-through-dom).
 *
 * Allowed:
 *   - http(s)://...   public images
 *   - blob:...        local previews via URL.createObjectURL
 *   - data:image/...  inline image data URLs only
 *   - relative paths starting with `/`
 */
export function isSafeImageUrl(url: string | null | undefined): url is string {
  if (typeof url !== "string" || url.length === 0) return false;
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  return /^(?:https?:|blob:|data:image\/[a-z0-9.+-]+[;,])/i.test(url);
}
