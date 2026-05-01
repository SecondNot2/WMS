"use client";

import React from "react";
import {
  Search,
  Clock,
  Box,
  Tag,
  Download,
  Truck,
  Upload,
  UserRound,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/client";
import { useActivityLogs } from "@/lib/hooks/use-activity-log";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@wms/types";

const moduleOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả module" },
  { value: "Product", label: "Sản phẩm" },
  { value: "Category", label: "Danh mục" },
  { value: "GoodsReceipt", label: "Nhập kho" },
  { value: "GoodsIssue", label: "Xuất kho" },
  { value: "Supplier", label: "Nhà cung cấp" },
  { value: "Recipient", label: "Đơn vị nhận" },
  { value: "User", label: "Người dùng" },
  { value: "Role", label: "Vai trò" },
];

const actionOptions: ComboboxOption<string>[] = [
  { value: "", label: "Tất cả hành động" },
  { value: "create", label: "Tạo mới" },
  { value: "update", label: "Cập nhật" },
  { value: "delete", label: "Xóa" },
  { value: "approve", label: "Phê duyệt" },
  { value: "reject", label: "Từ chối" },
  { value: "adjust", label: "Điều chỉnh" },
  { value: "import", label: "Import" },
  { value: "login", label: "Đăng nhập" },
  { value: "logout", label: "Đăng xuất" },
];

const actionStyles = {
  create: "bg-success/10 text-success border-success/20",
  update: "bg-accent/10 text-accent border-accent/20",
  approve: "bg-info/10 text-info border-info/20",
  reject: "bg-warning/10 text-warning border-warning/20",
  adjust: "bg-warning/10 text-warning border-warning/20",
  import: "bg-info/10 text-info border-info/20",
  auth: "bg-background-app text-text-secondary border-border-ui",
  delete: "bg-danger/10 text-danger border-danger/20",
  default: "bg-background-app text-text-secondary border-border-ui",
};

const moduleLabels: Record<string, string> = {
  Product: "Sản phẩm",
  Category: "Danh mục",
  GoodsReceipt: "Nhập kho",
  GoodsIssue: "Xuất kho",
  Supplier: "Nhà cung cấp",
  Recipient: "Đơn vị nhận",
  User: "Người dùng",
  Role: "Vai trò",
};

const moduleIcons: Record<string, LucideIcon> = {
  Product: Box,
  Category: Tag,
  GoodsReceipt: Download,
  GoodsIssue: Upload,
  Supplier: Truck,
  Recipient: Truck,
  User: UserRound,
  Role: Shield,
};

function getActionKind(action: string): keyof typeof actionStyles {
  const normalized = action.toLowerCase();
  if (normalized.includes("create")) return "create";
  if (normalized.includes("update")) return "update";
  if (normalized.includes("delete")) return "delete";
  if (normalized.includes("approve")) return "approve";
  if (normalized.includes("reject")) return "reject";
  if (normalized.includes("adjust")) return "adjust";
  if (normalized.includes("import")) return "import";
  if (normalized.includes("login") || normalized.includes("logout")) {
    return "auth";
  }
  return "default";
}

function getActionLabel(action: string) {
  const kind = getActionKind(action);
  const labels: Record<keyof typeof actionStyles, string> = {
    create: "Tạo mới",
    update: "Cập nhật",
    delete: "Xóa",
    approve: "Phê duyệt",
    reject: "Từ chối",
    adjust: "Điều chỉnh",
    import: "Import",
    auth: action.toLowerCase().includes("logout") ? "Đăng xuất" : "Đăng nhập",
    default: action,
  };
  return labels[kind];
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

const currencyFmt = new Intl.NumberFormat("vi-VN");

const DETAIL_KEY_LABELS: Record<string, string> = {
  itemCount: "sản phẩm",
  totalAmount: "tổng",
  quantity: "số lượng",
  stockBefore: "tồn trước",
  stockAfter: "tồn sau",
  reason: "lý do",
  name: "tên",
  sku: "SKU",
  email: "email",
  phone: "điện thoại",
  purpose: "mục đích",
  note: "ghi chú",
  isActive: "trạng thái",
  status: "trạng thái",
};

const SKIP_KEYS = new Set([
  "supplierId",
  "recipientId",
  "categoryId",
  "productId",
  "userId",
  "roleId",
  "id",
]);

function formatDetailValue(key: string, value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (key === "itemCount") return `${value} sản phẩm`;
  if (key === "totalAmount" || key === "stockValue") {
    return `tổng ${currencyFmt.format(Number(value))}đ`;
  }
  if (key === "stockBefore" || key === "stockAfter") {
    return `${DETAIL_KEY_LABELS[key]}: ${currencyFmt.format(Number(value))}`;
  }
  if (key === "isActive") return value ? "kích hoạt" : "vô hiệu";
  if (typeof value === "boolean") return value ? "có" : "không";
  if (typeof value === "object") return null;
  const label = DETAIL_KEY_LABELS[key] ?? key;
  return `${label}: ${String(value)}`;
}

function parseDetail(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return trimmed;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed === null || typeof parsed !== "object") return trimmed;

    // stockBefore + stockAfter → "tồn: A → B"
    const entries = Object.entries(parsed).filter(([k]) => !SKIP_KEYS.has(k));
    if (entries.length === 0) return null;

    if ("stockBefore" in parsed && "stockAfter" in parsed) {
      const before = currencyFmt.format(Number(parsed.stockBefore));
      const after = currencyFmt.format(Number(parsed.stockAfter));
      const others = entries
        .filter(([k]) => k !== "stockBefore" && k !== "stockAfter")
        .map(([k, v]) => formatDetailValue(k, v))
        .filter((s): s is string => Boolean(s));
      return [`tồn: ${before} → ${after}`, ...others].join(" • ");
    }

    const parts = entries
      .map(([k, v]) => formatDetailValue(k, v))
      .filter((s): s is string => Boolean(s));
    return parts.length > 0 ? parts.join(" • ") : null;
  } catch {
    return trimmed;
  }
}

function getDetail(log: ActivityLog): string {
  const parsed = parseDetail(log.detail);
  if (log.targetCode && parsed) return `${log.targetCode} • ${parsed}`;
  if (log.targetCode) return log.targetCode;
  if (parsed) return parsed;
  return getActionLabel(log.action);
}

export default function GlobalActivityLogPage() {
  const [module, setModule] = React.useState<string>("");
  const [action, setAction] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [limit, setLimit] = React.useState(20);

  const from = React.useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString();
  }, []);

  const query = React.useMemo(
    () => ({
      page: 1,
      limit,
      search: search.trim() || undefined,
      targetType: module || undefined,
      action: action || undefined,
      from,
    }),
    [action, from, limit, module, search],
  );

  const { data, isLoading, isError, error, refetch } = useActivityLogs(query);
  const logs = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const canLoadMore = logs.length < total;

  return (
    <div className="p-5 space-y-5">
      <PageHeader
        title="Nhật ký hoạt động hệ thống"
        description="Lưu trữ toàn bộ lịch sử thao tác của người dùng trên toàn hệ thống WMS"
      />

      {/* Filters */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_176px_176px_auto] gap-3 sm:items-center">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              placeholder="Tìm theo người dùng, nội dung, module..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setLimit(20);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background-app border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="min-w-0">
            <Combobox<string>
              value={module}
              onChange={(next) => {
                setModule(next);
                setLimit(20);
              }}
              options={moduleOptions}
              clearable={Boolean(module)}
            />
          </div>

          <div className="min-w-0">
            <Combobox<string>
              value={action}
              onChange={(next) => {
                setAction(next);
                setLimit(20);
              }}
              options={actionOptions}
              clearable={Boolean(action)}
            />
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 bg-background-app border border-border-ui rounded-lg">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary font-medium">
              7 ngày qua
            </span>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm overflow-hidden">
        <div className="divide-y divide-border-ui">
          {isLoading && (
            <div className="p-8 text-sm text-text-secondary">
              Đang tải nhật ký hoạt động...
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-8 text-sm">
              <p className="text-danger font-medium">
                {getApiErrorMessage(error, "Không thể tải nhật ký hoạt động")}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-xs font-bold text-accent hover:underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {!isLoading && !isError && logs.length === 0 && (
            <div className="p-8 text-sm text-text-secondary">
              Chưa có nhật ký hoạt động phù hợp với bộ lọc.
            </div>
          )}

          {!isLoading &&
            !isError &&
            logs.map((log) => {
              const Icon = log.targetType
                ? (moduleIcons[log.targetType] ?? Tag)
                : Tag;
              const kind = getActionKind(log.action);

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-background-app/20 transition-colors flex items-start gap-3 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-text-primary truncate">
                          {log.user.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background-app text-text-secondary border border-border-ui uppercase tracking-wider font-bold shrink-0">
                          {log.targetType
                            ? (moduleLabels[log.targetType] ?? log.targetType)
                            : "Hệ thống"}
                        </span>
                      </div>
                      <span className="text-[11px] text-text-secondary flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5" />{" "}
                        {formatTime(log.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight shrink-0 w-fit",
                          actionStyles[kind],
                        )}
                      >
                        {getActionLabel(log.action)}
                      </span>
                      <p className="text-sm text-text-primary font-medium line-clamp-3 sm:truncate">
                        {getDetail(log)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Load more */}
        <div className="p-4 bg-background-app/30 border-t border-border-ui text-center">
          <button
            disabled={!canLoadMore || isLoading}
            onClick={() => setLimit((current) => current + 20)}
            className="text-xs font-bold text-accent hover:underline disabled:text-text-secondary disabled:no-underline disabled:cursor-not-allowed"
          >
            {canLoadMore
              ? "Tải thêm nhật ký"
              : `Đã hiển thị ${logs.length}/${total}`}
          </button>
        </div>
      </div>
    </div>
  );
}
