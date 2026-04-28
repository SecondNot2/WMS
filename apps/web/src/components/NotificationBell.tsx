"use client";

import React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Clock,
  Download,
  Loader2,
  Upload,
} from "lucide-react";
import { useAlerts, useAlertStats } from "@/lib/hooks/use-alerts";
import { useInbounds } from "@/lib/hooks/use-inbound";
import { useOutbounds } from "@/lib/hooks/use-outbound";
import { cn } from "@/lib/utils";

const POLL_MS = 60_000;
const PER_TAB_LIMIT = 8;

type TabKey = "alerts" | "pending";

const formatRelative = (iso: string) => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return "vừa xong";
    if (min < 60) return `${min} phút trước`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour} giờ trước`;
    const day = Math.floor(hour / 24);
    return `${day} ngày trước`;
  } catch {
    return "—";
  }
};

export function NotificationBell() {
  const router = useRouter();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<TabKey>("alerts");
  const [position, setPosition] = React.useState<{
    top: number;
    right: number;
  } | null>(null);

  // ── Data sources với polling ──
  const alertsQ = useAlerts({ limit: PER_TAB_LIMIT });
  const alertStatsQ = useAlertStats();
  const inboundPendingQ = useInbounds({
    status: "PENDING",
    limit: Math.ceil(PER_TAB_LIMIT / 2),
  });
  const outboundPendingQ = useOutbounds({
    status: "PENDING",
    limit: Math.ceil(PER_TAB_LIMIT / 2),
  });

  // Polling thủ công vì useAlerts/useInbounds không bật refetchInterval mặc định
  React.useEffect(() => {
    const id = window.setInterval(() => {
      alertsQ.refetch();
      alertStatsQ.refetch();
      inboundPendingQ.refetch();
      outboundPendingQ.refetch();
    }, POLL_MS);
    return () => window.clearInterval(id);
    // refs từ React Query là stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertCount = alertStatsQ.data?.totalAlerts ?? 0;
  const inboundPendingCount = inboundPendingQ.data?.meta?.total ?? 0;
  const outboundPendingCount = outboundPendingQ.data?.meta?.total ?? 0;
  const pendingTotal = inboundPendingCount + outboundPendingCount;
  const totalBadge = alertCount + pendingTotal;

  // Position
  const computePos = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      right: window.innerWidth - rect.right,
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    computePos();
    const h = () => computePos();
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => {
      window.removeEventListener("resize", h);
      window.removeEventListener("scroll", h, true);
    };
  }, [open, computePos]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popupRef.current?.contains(t))
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const alerts = alertsQ.data?.data ?? [];
  const inbounds = inboundPendingQ.data?.data ?? [];
  const outbounds = outboundPendingQ.data?.data ?? [];

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2 hover:bg-background-app rounded-lg transition-colors text-text-secondary relative"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {totalBadge > 0 && (
          <span className="absolute top-1 right-1 min-w-3.5 h-3.5 px-1 bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-card-white">
            {totalBadge > 99 ? "99+" : totalBadge}
          </span>
        )}
      </button>

      {open &&
        position &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={popupRef}
            style={{
              position: "fixed",
              top: position.top,
              right: position.right,
              zIndex: 70,
              width: 380,
              maxWidth: "calc(100vw - 16px)",
            }}
            className="bg-card-white border border-border-ui rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-ui">
              <h3 className="text-sm font-bold text-text-primary">
                Thông báo
              </h3>
              <span className="text-[11px] text-text-secondary">
                Tự cập nhật mỗi 60 giây
              </span>
            </div>

            <div className="flex border-b border-border-ui">
              <TabButton
                active={tab === "alerts"}
                count={alertCount}
                onClick={() => setTab("alerts")}
              >
                Tồn kho thấp
              </TabButton>
              <TabButton
                active={tab === "pending"}
                count={pendingTotal}
                onClick={() => setTab("pending")}
              >
                Phiếu chờ duyệt
              </TabButton>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 400 }}>
              {tab === "alerts" ? (
                alertsQ.isLoading ? (
                  <Loading />
                ) : alerts.length === 0 ? (
                  <Empty message="Không có cảnh báo tồn kho" />
                ) : (
                  <ul className="divide-y divide-border-ui">
                    {alerts.map((a) => {
                      const isCritical = a.level === "CRITICAL";
                      return (
                        <li key={a.productId}>
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              router.push(`/products/${a.productId}`);
                            }}
                            className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-background-app/60 transition-colors"
                          >
                            <span
                              className={cn(
                                "shrink-0 w-9 h-9 rounded-md flex items-center justify-center",
                                isCritical
                                  ? "bg-danger/10 text-danger"
                                  : "bg-warning/10 text-warning",
                              )}
                            >
                              {isCritical ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : (
                                <AlertTriangle className="w-4 h-4" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-text-primary truncate">
                                {a.name}
                              </p>
                              <p className="text-[11px] text-text-secondary truncate">
                                {a.sku} · Tồn{" "}
                                <span
                                  className={cn(
                                    "font-bold",
                                    isCritical ? "text-danger" : "text-warning",
                                  )}
                                >
                                  {a.currentStock}
                                </span>
                                /{a.minStock}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                isCritical
                                  ? "bg-danger/10 text-danger"
                                  : "bg-warning/10 text-warning",
                              )}
                            >
                              {isCritical ? "Hết" : "Sắp hết"}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : inboundPendingQ.isLoading || outboundPendingQ.isLoading ? (
                <Loading />
              ) : pendingTotal === 0 ? (
                <Empty message="Không có phiếu chờ duyệt" />
              ) : (
                <ul className="divide-y divide-border-ui">
                  {inbounds.map((r) => (
                    <li key={`in-${r.id}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/inbound/${r.id}`);
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-background-app/60 transition-colors"
                      >
                        <span className="shrink-0 w-9 h-9 rounded-md bg-success/10 text-success flex items-center justify-center">
                          <Download className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-text-primary truncate">
                            {r.code}
                          </p>
                          <p className="text-[11px] text-text-secondary truncate">
                            {r.supplier?.name ?? "—"} · {r.itemCount} mặt hàng
                          </p>
                        </div>
                        <span className="shrink-0 flex items-center gap-1 text-[10px] text-text-secondary">
                          <Clock className="w-3 h-3" />
                          {formatRelative(r.createdAt)}
                        </span>
                      </button>
                    </li>
                  ))}
                  {outbounds.map((r) => (
                    <li key={`out-${r.id}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          router.push(`/outbound/${r.id}`);
                        }}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-background-app/60 transition-colors"
                      >
                        <span className="shrink-0 w-9 h-9 rounded-md bg-warning/10 text-warning flex items-center justify-center">
                          <Upload className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-text-primary truncate">
                            {r.code}
                          </p>
                          <p className="text-[11px] text-text-secondary truncate">
                            {r.recipient?.name ?? "—"} · {r.itemCount} mặt hàng
                          </p>
                        </div>
                        <span className="shrink-0 flex items-center gap-1 text-[10px] text-text-secondary">
                          <Clock className="w-3 h-3" />
                          {formatRelative(r.createdAt)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="px-4 py-2.5 bg-background-app/40 border-t border-border-ui flex justify-end">
              <Link
                href={tab === "alerts" ? "/alerts" : "/inbound?status=PENDING"}
                onClick={() => setOpen(false)}
                className="text-[12px] font-bold text-accent hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function TabButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-bold border-b-2 transition-colors",
        active
          ? "border-accent text-accent"
          : "border-transparent text-text-secondary hover:text-text-primary",
      )}
    >
      {children}
      {count > 0 && (
        <span
          className={cn(
            "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
            active ? "bg-accent text-white" : "bg-background-app text-text-secondary",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-text-secondary">
      <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-text-secondary">
      {message}
    </div>
  );
}
