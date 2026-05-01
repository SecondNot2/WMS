"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Building,
  Download,
  Loader2,
  Package,
  Search,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { inboundApi } from "@/lib/api/inbound";
import { outboundApi } from "@/lib/api/outbound";
import { suppliersApi } from "@/lib/api/suppliers";
import { recipientsApi } from "@/lib/api/recipients";
import { cn } from "@/lib/utils";

type ResultItem = {
  id: string;
  type: "product" | "inbound" | "outbound" | "supplier" | "recipient";
  title: string;
  subtitle?: string;
  href: string;
};

const TYPE_META: Record<
  ResultItem["type"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    cls: string;
  }
> = {
  product: {
    label: "Sản phẩm",
    icon: Package,
    cls: "bg-accent/10 text-accent",
  },
  inbound: {
    label: "Phiếu nhập",
    icon: Download,
    cls: "bg-success/10 text-success",
  },
  outbound: {
    label: "Phiếu xuất",
    icon: Upload,
    cls: "bg-warning/10 text-warning",
  },
  supplier: {
    label: "Nhà cung cấp",
    icon: Truck,
    cls: "bg-info/10 text-info",
  },
  recipient: {
    label: "Đơn vị nhận",
    icon: Building,
    cls: "bg-info/10 text-info",
  },
};

const PER_GROUP_LIMIT = 5;

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Debounce
  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(id);
  }, [query]);

  const enabled = debounced.length >= 2;

  const productsQuery = useQuery({
    queryKey: ["search", "products", debounced],
    queryFn: () =>
      productsApi.getAll({
        search: debounced,
        limit: PER_GROUP_LIMIT,
        isActive: true,
      }),
    enabled,
    staleTime: 30_000,
  });
  const inboundQuery = useQuery({
    queryKey: ["search", "inbound", debounced],
    queryFn: () =>
      inboundApi.getAll({ search: debounced, limit: PER_GROUP_LIMIT }),
    enabled,
    staleTime: 30_000,
  });
  const outboundQuery = useQuery({
    queryKey: ["search", "outbound", debounced],
    queryFn: () =>
      outboundApi.getAll({ search: debounced, limit: PER_GROUP_LIMIT }),
    enabled,
    staleTime: 30_000,
  });
  const suppliersQuery = useQuery({
    queryKey: ["search", "suppliers", debounced],
    queryFn: () =>
      suppliersApi.getAll({ search: debounced, limit: PER_GROUP_LIMIT }),
    enabled,
    staleTime: 30_000,
  });
  const recipientsQuery = useQuery({
    queryKey: ["search", "recipients", debounced],
    queryFn: () =>
      recipientsApi.getAll({ search: debounced, limit: PER_GROUP_LIMIT }),
    enabled,
    staleTime: 30_000,
  });

  const isLoading =
    enabled &&
    (productsQuery.isLoading ||
      inboundQuery.isLoading ||
      outboundQuery.isLoading ||
      suppliersQuery.isLoading ||
      recipientsQuery.isLoading);

  const groups = React.useMemo<
    { type: ResultItem["type"]; items: ResultItem[] }[]
  >(() => {
    if (!enabled) return [];

    const products: ResultItem[] = (productsQuery.data?.data ?? []).map(
      (p) => ({
        id: p.id,
        type: "product",
        title: p.name,
        subtitle: `${p.sku}${p.barcode ? ` · ${p.barcode}` : ""} · Tồn: ${p.currentStock} ${p.unit}`,
        href: `/products/${p.id}`,
      }),
    );
    const inbounds: ResultItem[] = (inboundQuery.data?.data ?? []).map((r) => ({
      id: r.id,
      type: "inbound",
      title: r.code,
      subtitle: `${r.supplier?.name ?? "—"} · ${r.itemCount} mặt hàng`,
      href: `/inbound/${r.id}`,
    }));
    const outbounds: ResultItem[] = (outboundQuery.data?.data ?? []).map(
      (r) => ({
        id: r.id,
        type: "outbound",
        title: r.code,
        subtitle: `${r.recipient?.name ?? "—"} · ${r.itemCount} mặt hàng`,
        href: `/outbound/${r.id}`,
      }),
    );
    const suppliers: ResultItem[] = (suppliersQuery.data?.data ?? []).map(
      (s) => ({
        id: s.id,
        type: "supplier",
        title: s.name,
        subtitle: [s.taxCode, s.phone].filter(Boolean).join(" · ") || undefined,
        href: `/suppliers/${s.id}`,
      }),
    );
    const recipients: ResultItem[] = (recipientsQuery.data?.data ?? []).map(
      (r) => ({
        id: r.id,
        type: "recipient",
        title: r.name,
        subtitle: [r.phone, r.email].filter(Boolean).join(" · ") || undefined,
        href: `/receivers/${r.id}`,
      }),
    );

    return [
      { type: "product" as const, items: products },
      { type: "inbound" as const, items: inbounds },
      { type: "outbound" as const, items: outbounds },
      { type: "supplier" as const, items: suppliers },
      { type: "recipient" as const, items: recipients },
    ].filter((g) => g.items.length > 0);
  }, [
    enabled,
    productsQuery.data,
    inboundQuery.data,
    outboundQuery.data,
    suppliersQuery.data,
    recipientsQuery.data,
  ]);

  const flatItems = React.useMemo(
    () => groups.flatMap((g) => g.items),
    [groups],
  );

  React.useEffect(() => {
    // Reset highlight khi danh sách kết quả đổi — UI state, không phải sync với external
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHighlight(0);
  }, [debounced, groups.length]);

  // Compute popup position
  const computePos = React.useCallback(() => {
    if (!triggerRef.current) return;
    if (window.innerWidth < 768) {
      setPosition({
        top: 72,
        left: 12,
        width: window.innerWidth - 24,
      });
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - 480 - 16),
      width: Math.max(rect.width, 480),
    });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const raf = window.requestAnimationFrame(computePos);
    const h = () => computePos();
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", h);
      window.removeEventListener("scroll", h, true);
    };
  }, [open, computePos]);

  // Click outside
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

  // Cmd+K / Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when open
  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleSelect = (item: ResultItem) => {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!flatItems.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatItems[highlight];
      if (item) handleSelect(item);
    }
  };

  // Map index -> meta để highlight đúng cross-group
  let runningIndex = -1;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "pl-9 pr-3 py-2 bg-background-app border-transparent rounded-full text-xs flex items-center w-10 md:w-64 text-left text-text-secondary hover:bg-card-white hover:border-accent/30 border transition-all",
          open && "bg-card-white border-accent/40",
        )}
        aria-label="Tìm kiếm"
      >
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <span className="truncate flex-1 hidden md:inline">Tìm kiếm...</span>
        <kbd className="ml-2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border-ui bg-card-white text-[9px] font-mono text-text-secondary">
          ⌘K
        </kbd>
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
              left: position.left,
              width: position.width,
              zIndex: 70,
              maxHeight: "calc(100vh - 100px)",
            }}
            className="bg-card-white border border-border-ui rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="relative border-b border-border-ui">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Tìm sản phẩm, phiếu nhập/xuất, NCC, đơn vị nhận..."
                className="w-full pl-11 pr-12 py-3 text-sm bg-card-white outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-secondary hover:bg-background-app"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {!enabled ? (
                <div className="px-4 py-10 text-center text-sm text-text-secondary">
                  Nhập tối thiểu 2 ký tự để tìm kiếm
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-text-secondary">
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang tìm...
                </div>
              ) : groups.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-text-secondary">
                  Không có kết quả phù hợp với “{debounced}”
                </div>
              ) : (
                groups.map((group) => {
                  const meta = TYPE_META[group.type];
                  return (
                    <div key={group.type} className="py-2">
                      <p className="px-4 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        {meta.label}
                      </p>
                      <ul>
                        {group.items.map((item) => {
                          runningIndex += 1;
                          const isActive = runningIndex === highlight;
                          const Icon = meta.icon;
                          return (
                            <li key={`${item.type}-${item.id}`}>
                              <button
                                type="button"
                                onMouseEnter={() => {
                                  // capture current running index per render
                                  const idx = flatItems.findIndex(
                                    (x) =>
                                      x.id === item.id && x.type === item.type,
                                  );
                                  if (idx >= 0) setHighlight(idx);
                                }}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                  "w-full flex items-start gap-3 px-4 py-2 text-left transition-colors",
                                  isActive
                                    ? "bg-accent/5"
                                    : "hover:bg-background-app/60",
                                )}
                              >
                                <span
                                  className={cn(
                                    "shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
                                    meta.cls,
                                  )}
                                >
                                  <Icon className="w-4 h-4" />
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-semibold text-text-primary truncate">
                                    {item.title}
                                  </p>
                                  {item.subtitle && (
                                    <p className="text-[11px] text-text-secondary truncate">
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between gap-2 px-4 py-2 bg-background-app/40 border-t border-border-ui text-[10px] text-text-secondary">
              <span className="flex items-center gap-3">
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-card-white border border-border-ui font-mono">
                    ↑↓
                  </kbd>{" "}
                  điều hướng
                </span>
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-card-white border border-border-ui font-mono">
                    Enter
                  </kbd>{" "}
                  chọn
                </span>
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded bg-card-white border border-border-ui font-mono">
                  Esc
                </kbd>{" "}
                đóng
              </span>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
