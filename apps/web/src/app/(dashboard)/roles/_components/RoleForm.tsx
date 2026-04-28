"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { PermissionMatrix } from "./PermissionMatrix";
import { useCreateRole, useUpdateRole } from "@/lib/hooks/use-roles";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/lib/api/client";
import { createRoleSchema, updateRoleSchema } from "@wms/validations";
import type { RoleEntity, RolePermissions } from "@wms/types";

interface RoleFormProps {
  initialData?: RoleEntity;
}

export function RoleForm({ initialData }: RoleFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [name, setName] = React.useState(initialData?.name ?? "");
  const [permissions, setPermissions] = React.useState<RolePermissions>(
    initialData?.permissions ?? {},
  );
  const [errors, setErrors] = React.useState<{ name?: string; root?: string }>(
    {},
  );

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole(initialData?.id ?? "");
  const toast = useToast();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const schema = isEdit ? updateRoleSchema : createRoleSchema;
    const parsed = schema.safeParse({ name, permissions });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "name") fieldErrors.name = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ name, permissions });
        toast.success(`Đã cập nhật vai trò ${name}`);
      } else {
        await createMutation.mutateAsync({ name, permissions });
        toast.success(`Đã tạo vai trò ${name}`);
      }
      router.push("/roles");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Không thể lưu vai trò");
      setErrors({ root: msg });
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-20">
      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" /> Thông tin vai trò
        </h3>

        {errors.root && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-danger/5 border border-danger/20 text-xs text-danger">
            {errors.root}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-text-secondary">
              Mã vai trò <span className="text-danger">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="VD: MANAGER"
              className={cn(
                "w-full px-3 py-2 text-sm bg-background-app/50 border rounded-lg outline-none focus:border-accent transition-colors uppercase font-mono",
                errors.name ? "border-danger" : "border-border-ui",
              )}
            />
            {errors.name && (
              <p className="text-[10px] text-danger font-medium">
                {errors.name}
              </p>
            )}
            <p className="text-[10px] text-text-secondary">
              Chỉ chữ in hoa, số và dấu gạch dưới
            </p>
          </div>
        </div>
      </div>

      <PermissionMatrix permissions={permissions} onChange={setPermissions} />

      <div className="bg-card-white rounded-xl border border-border-ui shadow-sm p-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="px-4 py-2 border border-border-ui rounded-lg text-sm font-bold text-text-primary hover:bg-background-app transition-colors disabled:opacity-60"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-accent/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? "Cập nhật" : "Lưu vai trò"}
        </button>
      </div>
    </form>
  );
}
