"use client";

import React from "react";
import {
  AlertTriangle,
  Bell,
  Database,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/Toast";
import { ConfirmDialog } from "@/components/Dialog";
import { useAuthStore } from "@/lib/store";
import { getApiErrorMessage } from "@/lib/api/client";
import { useResetSettings, useSettings } from "@/lib/hooks/use-settings";
import { GeneralSettingsForm } from "./_components/GeneralSettingsForm";
import { AlertSettingsForm } from "./_components/AlertSettingsForm";
import { SecuritySettingsForm } from "./_components/SecuritySettingsForm";
import { IntegrationSettingsForm } from "./_components/IntegrationSettingsForm";

const tabs = [
  { id: "general", label: "Thông tin kho", icon: Warehouse },
  { id: "alerts", label: "Cảnh báo", icon: Bell },
  { id: "security", label: "Bảo mật", icon: ShieldCheck },
  { id: "integrations", label: "Tích hợp", icon: Database },
] as const;

type SettingsTab = (typeof tabs)[number]["id"];

type DirtyMap = Record<SettingsTab, boolean>;

const INITIAL_DIRTY: DirtyMap = {
  general: false,
  alerts: false,
  security: false,
  integrations: false,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("general");
  const [dirtyMap, setDirtyMap] = React.useState<DirtyMap>(INITIAL_DIRTY);
  const [pendingTab, setPendingTab] = React.useState<SettingsTab | null>(null);
  const [resetOpen, setResetOpen] = React.useState(false);

  const role = useAuthStore((s) => s.user?.role);
  const canEdit = role === "ADMIN";
  const toast = useToast();

  const { data, isLoading, error, refetch } = useSettings();
  const resetMutation = useResetSettings();

  const handleDirtyChange = React.useCallback(
    (tab: SettingsTab) => (dirty: boolean) =>
      setDirtyMap((prev) =>
        prev[tab] === dirty ? prev : { ...prev, [tab]: dirty },
      ),
    [],
  );

  const requestSwitchTab = (next: SettingsTab) => {
    if (next === activeTab) return;
    if (dirtyMap[activeTab]) {
      setPendingTab(next);
      return;
    }
    setActiveTab(next);
  };

  const confirmDiscardSwitch = () => {
    if (pendingTab) {
      // Reset dirty flag của tab cũ — form sẽ remount với defaults từ server
      setDirtyMap((prev) => ({ ...prev, [activeTab]: false }));
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync();
      setDirtyMap(INITIAL_DIRTY);
      setResetOpen(false);
      toast.success("Đã khôi phục cấu hình mặc định");
    } catch (e) {
      toast.error(getApiErrorMessage(e, "Không thể khôi phục cấu hình"));
    }
  };

  const hasAnyDirty = Object.values(dirtyMap).some(Boolean);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Cài đặt hệ thống
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Cấu hình thông tin kho, cảnh báo, bảo mật và tích hợp dữ liệu
          </p>
        </div>
        {hasAnyDirty && (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-warning bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Có thay đổi chưa lưu
          </span>
        )}
      </div>

      {!canEdit && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-text-primary">
              Chế độ chỉ xem
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Chỉ Quản trị viên (ADMIN) mới có quyền chỉnh sửa cấu hình hệ thống.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <aside className="xl:col-span-3 bg-card-white rounded-xl border border-border-ui shadow-sm p-4 h-fit">
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDirty = dirtyMap[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => requestSwitchTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-text-secondary hover:bg-background-app hover:text-text-primary",
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isDirty && (
                    <span
                      title="Có thay đổi chưa lưu"
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        isActive ? "bg-white" : "bg-warning",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="xl:col-span-9 space-y-6">
          {isLoading && (
            <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
              <span className="ml-3 text-sm text-text-secondary">
                Đang tải cấu hình...
              </span>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-card-white rounded-xl border border-danger/30 shadow-sm p-6 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-danger mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    Không thể tải cấu hình
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    {getApiErrorMessage(error, "Đã xảy ra lỗi khi tải dữ liệu")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => refetch()}
                className="text-xs font-medium text-accent hover:underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {data && !isLoading && (
            <>
              {activeTab === "general" && (
                <GeneralSettingsForm
                  defaults={data.values.general}
                  meta={data.meta.general}
                  canEdit={canEdit}
                  onDirtyChange={handleDirtyChange("general")}
                />
              )}
              {activeTab === "alerts" && (
                <AlertSettingsForm
                  defaults={data.values.alerts}
                  meta={data.meta.alerts}
                  canEdit={canEdit}
                  onDirtyChange={handleDirtyChange("alerts")}
                />
              )}
              {activeTab === "security" && (
                <SecuritySettingsForm
                  defaults={data.values.security}
                  meta={data.meta.security}
                  canEdit={canEdit}
                  onDirtyChange={handleDirtyChange("security")}
                />
              )}
              {activeTab === "integrations" && (
                <IntegrationSettingsForm
                  defaults={data.values.integrations}
                  meta={data.meta.integrations}
                  canEdit={canEdit}
                  onDirtyChange={handleDirtyChange("integrations")}
                />
              )}

              {canEdit && (
                <div className="bg-card-white rounded-xl border border-border-ui shadow-sm px-6 py-5 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setResetOpen(true)}
                    disabled={resetMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 border border-border-ui rounded-lg text-sm font-medium text-text-primary hover:bg-background-app transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resetMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    Khôi phục mặc định
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={pendingTab !== null}
        onClose={() => setPendingTab(null)}
        title="Bỏ qua thay đổi chưa lưu?"
        message="Tab hiện tại có thay đổi chưa được lưu. Tiếp tục sẽ làm mất các thay đổi này."
        variant="warning"
        confirmLabel="Bỏ qua thay đổi"
        cancelLabel="Ở lại"
        onConfirm={confirmDiscardSwitch}
      />

      <ConfirmDialog
        open={resetOpen}
        onClose={() => !resetMutation.isPending && setResetOpen(false)}
        title="Khôi phục cấu hình mặc định?"
        message="Toàn bộ 4 nhóm cấu hình sẽ được đặt lại về giá trị gốc. Hành động này được ghi vào nhật ký hoạt động và không thể hoàn tác."
        variant="danger"
        confirmLabel="Khôi phục"
        loading={resetMutation.isPending}
        onConfirm={handleReset}
      />
    </div>
  );
}
