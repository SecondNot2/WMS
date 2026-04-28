"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { AlertStats } from "./_components/AlertStats";
import { AlertFilters } from "./_components/AlertFilters";
import { AlertTable } from "./_components/AlertTable";
import { ALERT_KEYS } from "@/lib/hooks/use-alerts";
import type { AlertLevel } from "@wms/types";

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [level, setLevel] = React.useState<AlertLevel | "">("");
  const [categoryId, setCategoryId] = React.useState("");

  const handleReset = () => {
    setSearch("");
    setLevel("");
    setCategoryId("");
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ALERT_KEYS.all });
  };

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            Trung tâm cảnh báo
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Theo dõi và xử lý các sản phẩm có tồn kho thấp
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-card-white border border-border-ui text-text-primary hover:bg-background-app text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <AlertStats />

      {/* Filters + Table */}
      <AlertFilters
        search={search}
        level={level}
        categoryId={categoryId}
        onSearchChange={setSearch}
        onLevelChange={setLevel}
        onCategoryChange={setCategoryId}
        onReset={handleReset}
      />
      <AlertTable search={search} level={level} categoryId={categoryId} />
    </div>
  );
}
