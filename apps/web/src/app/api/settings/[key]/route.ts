import {
  settingsKeyParamsSchema,
  updateAlertSettingsSchema,
  updateGeneralSettingsSchema,
  updateIntegrationSettingsSchema,
  updateSecuritySettingsSchema,
  type SettingsKeyInput,
} from "@wms/validations";
import { AppError } from "@/server/lib/errors";
import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/settings.service";

const BODY_SCHEMA = {
  general: updateGeneralSettingsSchema,
  alerts: updateAlertSettingsSchema,
  security: updateSecuritySettingsSchema,
  integrations: updateIntegrationSettingsSchema,
} as const;

function parseKey(rawKey: string): SettingsKeyInput {
  const parsed = settingsKeyParamsSchema.safeParse({ key: rawKey });
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Settings key không hợp lệ");
  }
  return parsed.data.key;
}

export const GET = handle<{ key: string }>(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (_req, { params }) => ok(await service.getSettingsByKey(parseKey(params.key))),
);

export const PATCH = handle<{ key: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const key = parseKey(params.key);
    const schema = BODY_SCHEMA[key];
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      throw new AppError("VALIDATION_ERROR", "Body không phải JSON hợp lệ");
    }
    const body = schema.parse(raw);
    return ok(await service.updateSettings(key, body, user!.id));
  },
);
