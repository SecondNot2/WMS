"use client";

import { Clock, UserRound } from "lucide-react";
import type { SystemSettingMeta } from "@wms/types";

function formatDate(value: string | null) {
  if (!value) return "Chưa từng cập nhật";
  const d = new Date(value);
  return d.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function SettingsMeta({ meta }: { meta: SystemSettingMeta }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-text-secondary">
      <span className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        Cập nhật: {formatDate(meta.updatedAt)}
      </span>
      {meta.updatedBy && (
        <span className="flex items-center gap-1.5">
          <UserRound className="w-3.5 h-3.5" />
          Bởi {meta.updatedBy.name}
        </span>
      )}
    </div>
  );
}
