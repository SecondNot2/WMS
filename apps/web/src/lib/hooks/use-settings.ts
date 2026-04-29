"use client";

// TanStack Query hooks for system settings module.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi, type GroupResult } from "@/lib/api/settings";
import type {
  SettingsKey,
  SystemSettingsResponse,
  UpdateAlertSettingsInput,
  UpdateGeneralSettingsInput,
  UpdateIntegrationSettingsInput,
  UpdateSecuritySettingsInput,
} from "@wms/types";

export const SETTINGS_KEYS = {
  all: ["settings"] as const,
  root: () => [...SETTINGS_KEYS.all, "root"] as const,
  group: (key: SettingsKey) => [...SETTINGS_KEYS.all, "group", key] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.root(),
    queryFn: () => settingsApi.getAll(),
    staleTime: 30_000,
  });
}

function syncRootCache<K extends SettingsKey>(
  qc: ReturnType<typeof useQueryClient>,
  key: K,
  result: GroupResult<K>,
) {
  qc.setQueryData<SystemSettingsResponse>(SETTINGS_KEYS.root(), (prev) =>
    prev
      ? {
          values: { ...prev.values, [key]: result.value },
          meta: { ...prev.meta, [key]: result.meta },
        }
      : prev,
  );
  qc.setQueryData(SETTINGS_KEYS.group(key), result);
}

export function useUpdateGeneralSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGeneralSettingsInput) =>
      settingsApi.update("general", data),
    onSuccess: (data) => syncRootCache(qc, "general", data),
  });
}

export function useUpdateAlertSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAlertSettingsInput) =>
      settingsApi.update("alerts", data),
    onSuccess: (data) => syncRootCache(qc, "alerts", data),
  });
}

export function useUpdateSecuritySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSecuritySettingsInput) =>
      settingsApi.update("security", data),
    onSuccess: (data) => syncRootCache(qc, "security", data),
  });
}

export function useUpdateIntegrationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIntegrationSettingsInput) =>
      settingsApi.update("integrations", data),
    onSuccess: (data) => syncRootCache(qc, "integrations", data),
  });
}

export function useResetSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => settingsApi.reset(),
    onSuccess: (data) => {
      qc.setQueryData(SETTINGS_KEYS.root(), data);
      (Object.keys(data.values) as SettingsKey[]).forEach((k) => {
        qc.setQueryData(SETTINGS_KEYS.group(k), {
          value: data.values[k],
          meta: data.meta[k],
        });
      });
    },
  });
}
