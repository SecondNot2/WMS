"use client";

import React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { RoleEntity } from "@wms/types";

export interface UserFilterValues {
  search: string;
  roleId: string;
  isActive: string; // "" | "true" | "false"
}

interface UserFiltersProps {
  value: UserFilterValues;
  onChange: (next: UserFilterValues) => void;
  roles: RoleEntity[];
  isLoadingRoles?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Quản trị viên",
  WAREHOUSE_STAFF: "Thủ kho",
  ACCOUNTANT: "Kế toán",
};

const labelOf = (name: string) => ROLE_LABELS[name] ?? name;

export function UserFilters({
  value,
  onChange,
  roles,
  isLoadingRoles,
}: UserFiltersProps) {
  const reset = () => onChange({ search: "", roleId: "", isActive: "" });
  const set = <K extends keyof UserFilterValues>(
    key: K,
    v: UserFilterValues[K],
  ) => onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-wrap items-center gap-3 bg-card-white p-4 rounded-xl border border-border-ui shadow-sm">
      <div className="relative flex-1 min-w-60">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={value.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Tìm theo tên, email..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-background-app/50 border border-border-ui rounded-lg outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Vai trò
          </label>
          <select
            value={value.roleId}
            onChange={(e) => set("roleId", e.target.value)}
            disabled={isLoadingRoles}
            className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-42 focus:border-accent disabled:opacity-50"
          >
            <option value="">Tất cả</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {labelOf(r.name)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Trạng thái
          </label>
          <select
            value={value.isActive}
            onChange={(e) => set("isActive", e.target.value)}
            className="text-sm bg-background-app/50 border border-border-ui rounded-lg px-3 py-2 outline-none text-text-primary min-w-35 focus:border-accent"
          >
            <option value="">Tất cả</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã khóa</option>
          </select>
        </div>

        <button
          type="button"
          className="mt-5 flex items-center gap-2 px-3 py-2 border border-border-ui rounded-lg text-sm font-medium text-text-primary hover:bg-background-app transition-colors"
        >
          <Filter className="w-4 h-4" /> Bộ lọc
        </button>

        <button
          type="button"
          onClick={reset}
          className="mt-5 flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary hover:text-accent hover:bg-accent/5 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Xóa lọc
        </button>
      </div>
    </div>
  );
}
