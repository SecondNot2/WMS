/**
 * Realtime broadcast helper — thay thế WebSocket bằng Supabase Realtime broadcast channel.
 *
 * Server-side: dùng service role key gửi broadcast qua kênh `wms`.
 * Client-side: subscribe kênh `wms` qua supabase-js.
 *
 * Các function emit* giữ nguyên tên/signature giống `apps/api/src/lib/websocket.ts`
 * để services có thể copy nguyên xi sang đây không cần sửa.
 *
 * Nếu thiếu env (SUPABASE_URL / SERVICE_ROLE_KEY) → silent no-op (vẫn cho dev local).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { logger } from "./logger";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const REALTIME_CHANNEL = process.env.SUPABASE_REALTIME_CHANNEL ?? "wms";

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return _client;
}

async function broadcast<T>(event: string, payload: T) {
  const client = getClient();
  if (!client) {
    logger.debug(`[realtime] skip ${event} (Supabase env missing)`);
    return;
  }
  try {
    const channel = client.channel(REALTIME_CHANNEL, {
      config: { broadcast: { self: false, ack: false } },
    });
    await channel.send({
      type: "broadcast",
      event,
      payload: { ...payload, ts: new Date().toISOString() },
    });
    // Cleanup: remove channel sau khi gửi (serverless mỗi request 1 client mới)
    await client.removeChannel(channel);
  } catch (err) {
    logger.warn(
      `[realtime] broadcast failed event=${event}: ${(err as Error).message}`,
    );
  }
}

// ─────────────────────────────────────────
// Public emit helpers — giống chữ ký websocket.ts cũ
// ─────────────────────────────────────────

export function emitStockUpdated(productIds: string[]) {
  if (productIds.length === 0) return;
  void broadcast("stock:updated", { productIds });
}

export interface InboundEventPayload {
  id: string;
  code: string;
  status?: string;
  approvedById?: string | null;
  rejectedReason?: string | null;
}

export function emitInboundCreated(payload: InboundEventPayload) {
  void broadcast("inbound:created", payload);
}
export function emitInboundApproved(payload: InboundEventPayload) {
  void broadcast("inbound:approved", payload);
}
export function emitInboundRejected(payload: InboundEventPayload) {
  void broadcast("inbound:rejected", payload);
}

export interface OutboundEventPayload {
  id: string;
  code: string;
  status?: string;
  approvedById?: string | null;
  rejectedReason?: string | null;
}

export function emitOutboundCreated(payload: OutboundEventPayload) {
  void broadcast("outbound:created", payload);
}
export function emitOutboundApproved(payload: OutboundEventPayload) {
  void broadcast("outbound:approved", payload);
}
export function emitOutboundRejected(payload: OutboundEventPayload) {
  void broadcast("outbound:rejected", payload);
}
