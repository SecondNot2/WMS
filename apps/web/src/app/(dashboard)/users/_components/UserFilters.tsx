"use client";

import React from "react";
import { Filter, RotateCcw, Search, Shield } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/Combobox";
import { ROLE_LABELS } from "@/lib/permissions";
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
        <div className="flex flex-col gap-1 min-w-44">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Vai trò
          </label>
          <Combobox<string>
            value={value.roleId}
            onChange={(next) => set("roleId", next)}
            options={[
              { value: "", label: "Tất cả" },
              ...roles.map<ComboboxOption<string>>((r) => ({
                value: r.id,
                label: labelOf(r.name),
                hint: r.name,
                icon: (
                  <span className="w-6 h-6 rounded bg-accent/10 text-accent flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </span>
                ),
              })),
            ]}
            loading={isLoadingRoles}
            clearable={Boolean(value.roleId)}
          />
        </div>

        <div className="flex flex-col gap-1 min-w-40">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">
            Trạng thái
          </label>
          <Combobox<string>
            value={value.isActive}
            onChange={(next) => set("isActive", next)}
            options={[
              { value: "", label: "Tất cả" },
              { value: "true", label: "Đang hoạt động" },
              { value: "false", label: "Đã khóa" },
            ]}
            searchable={false}
          />
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
