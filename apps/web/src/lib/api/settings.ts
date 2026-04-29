import { apiClient } from "./client";
import type {
  AlertSettings,
  ApiSuccessResponse,
  GeneralSettings,
  IntegrationSettings,
  SecuritySettings,
  SettingsKey,
  SystemSettingMeta,
  SystemSettingsResponse,
  UpdateAlertSettingsInput,
  UpdateGeneralSettingsInput,
  UpdateIntegrationSettingsInput,
  UpdateSecuritySettingsInput,
} from "@wms/types";

type GroupValueMap = {
  general: GeneralSettings;
  alerts: AlertSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
};

type GroupUpdateMap = {
  general: UpdateGeneralSettingsInput;
  alerts: UpdateAlertSettingsInput;
  security: UpdateSecuritySettingsInput;
  integrations: UpdateIntegrationSettingsInput;
};

export interface GroupResult<K extends SettingsKey> {
  value: GroupValueMap[K];
  meta: SystemSettingMeta;
}

export const settingsApi = {
  getAll: () =>
    apiClient
      .get<ApiSuccessResponse<SystemSettingsResponse>>("/settings")
      .then((r) => r.data.data),

  getByKey: <K extends SettingsKey>(key: K) =>
    apiClient
      .get<ApiSuccessResponse<GroupResult<K>>>(`/settings/${key}`)
      .then((r) => r.data.data),

  update: <K extends SettingsKey>(key: K, data: GroupUpdateMap[K]) =>
    apiClient
      .patch<ApiSuccessResponse<GroupResult<K>>>(`/settings/${key}`, data)
      .then((r) => r.data.data),

  reset: () =>
    apiClient
      .post<ApiSuccessResponse<SystemSettingsResponse>>("/settings/reset")
      .then((r) => r.data.data),
};
