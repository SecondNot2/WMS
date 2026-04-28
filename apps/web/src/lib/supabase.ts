"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client cho phía web — chỉ dùng cho Storage (upload ảnh).
 * KHÔNG dùng cho DB queries — vẫn đi qua API backend bình thường.
 *
 * Yêu cầu env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Bucket mặc định: `wms-uploads` (public read).
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SUPABASE_BUCKET = "wms-uploads";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Trích path nội bộ trong bucket từ public URL.
 * VD: https://x.supabase.co/storage/v1/object/public/wms-uploads/products/abc.jpg
 *  → "products/abc.jpg"
 * Trả null nếu URL không thuộc bucket này.
 */
export function extractStoragePath(
  url: string | null | undefined,
  bucket: string = SUPABASE_BUCKET,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

/**
 * Xóa 1 file khỏi bucket dựa trên public URL. Không throw nếu URL không hợp
 * lệ hoặc Supabase chưa cấu hình — chỉ best-effort cleanup.
 */
export async function removeStorageFileByUrl(
  url: string | null | undefined,
  bucket: string = SUPABASE_BUCKET,
): Promise<{ ok: boolean; error?: string }> {
  const path = extractStoragePath(url, bucket);
  if (!path) return { ok: false, error: "URL không thuộc bucket" };
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: "Supabase chưa cấu hình" };
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
