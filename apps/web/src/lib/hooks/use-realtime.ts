"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase";
import { PRODUCT_KEYS } from "./use-products";
import { INVENTORY_KEYS } from "./use-inventory";
import { ALERT_KEYS } from "./use-alerts";
import { INBOUND_KEYS } from "./use-inbound";
import { OUTBOUND_KEYS } from "./use-outbound";
import { ACTIVITY_LOG_KEYS } from "./use-activity-log";

const CHANNEL = process.env.NEXT_PUBLIC_SUPABASE_REALTIME_CHANNEL ?? "wms";

/**
 * Subscribe Supabase Realtime broadcast channel `wms` để invalidate
 * TanStack Query cache khi server emit sự kiện (xem `server/lib/websocket.ts`).
 *
 * Gắn 1 lần ở dashboard layout. Tự cleanup khi unmount.
 */
export function useWmsRealtime() {
  const qc = useQueryClient();

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    const invalidateStock = () => {
      qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      qc.invalidateQueries({ queryKey: INVENTORY_KEYS.all });
      qc.invalidateQueries({ queryKey: ALERT_KEYS.all });
    };

    const invalidateInbound = () => {
      qc.invalidateQueries({ queryKey: INBOUND_KEYS.all });
      qc.invalidateQueries({ queryKey: ACTIVITY_LOG_KEYS.all });
    };

    const invalidateOutbound = () => {
      qc.invalidateQueries({ queryKey: OUTBOUND_KEYS.all });
      qc.invalidateQueries({ queryKey: ACTIVITY_LOG_KEYS.all });
    };

    const channel = client
      .channel(CHANNEL, { config: { broadcast: { self: false } } })
      .on("broadcast", { event: "stock:updated" }, invalidateStock)
      .on("broadcast", { event: "inbound:created" }, invalidateInbound)
      .on("broadcast", { event: "inbound:approved" }, () => {
        invalidateInbound();
        invalidateStock();
      })
      .on("broadcast", { event: "inbound:rejected" }, invalidateInbound)
      .on("broadcast", { event: "outbound:created" }, invalidateOutbound)
      .on("broadcast", { event: "outbound:approved" }, () => {
        invalidateOutbound();
        invalidateStock();
      })
      .on("broadcast", { event: "outbound:rejected" }, invalidateOutbound)
      .subscribe();

    return () => {
      void client.removeChannel(channel);
    };
  }, [qc]);
}
