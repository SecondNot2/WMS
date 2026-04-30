import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { logActivity } from "../lib/activityLog";
import {
  alertSettingsSchema,
  generalSettingsSchema,
  integrationSettingsSchema,
  securitySettingsSchema,
  type SettingsKeyInput,
  type UpdateAlertSettingsSchemaInput,
  type UpdateGeneralSettingsSchemaInput,
  type UpdateIntegrationSettingsSchemaInput,
  type UpdateSecuritySettingsSchemaInput,
} from "@wms/validations";
import type {
  AlertSettings,
  GeneralSettings,
  IntegrationSettings,
  SecuritySettings,
  SystemSettingMeta,
  SystemSettings,
  SystemSettingsMetaMap,
  SystemSettingsResponse,
} from "@wms/types";

// ─────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────

const DEFAULTS: SystemSettings = {
  general: {
    systemName: "WMS System",
    warehouseCode: "WMS-LS-001",
    warehouseName: "Kho cửa khẩu Lạng Sơn",
    adminEmail: "admin@wms.com",
    address: "Khu logistics cửa khẩu, Lạng Sơn",
  },
  alerts: {
    lowStockPercent: 100,
    pendingHours: 24,
    summaryFrequency: "daily",
    emailLowStock: true,
    emailPendingOverdue: true,
    emailIssueRejected: true,
  },
  security: {
    accessTokenMinutes: 15,
    refreshTokenDays: 7,
    maxFailedLogin: 5,
    requirePeriodicReset: false,
    autoLockInactive: false,
  },
  integrations: {
    webhookUrl: null,
    defaultReportFormat: "xlsx",
    smtpHost: null,
    notificationEmail: null,
  },
};

const VALIDATORS = {
  general: generalSettingsSchema,
  alerts: alertSettingsSchema,
  security: securitySettingsSchema,
  integrations: integrationSettingsSchema,
} as const;

const KEYS: SettingsKeyInput[] = [
  "general",
  "alerts",
  "security",
  "integrations",
];

const KEY_LABELS: Record<SettingsKeyInput, string> = {
  general: "Thông tin kho",
  alerts: "Cảnh báo",
  security: "Bảo mật",
  integrations: "Tích hợp",
};

type GroupValue<K extends SettingsKeyInput> = K extends "general"
  ? GeneralSettings
  : K extends "alerts"
    ? AlertSettings
    : K extends "security"
      ? SecuritySettings
      : K extends "integrations"
        ? IntegrationSettings
        : never;

function mergeWithDefaults<K extends SettingsKeyInput>(
  key: K,
  value: unknown,
): GroupValue<K> {
  const defaults = DEFAULTS[key];
  const raw = value && typeof value === "object" ? value : {};
  return { ...defaults, ...(raw as object) } as GroupValue<K>;
}

// ─────────────────────────────────────────
// CACHE — invalidated khi update / reset
// ─────────────────────────────────────────

interface CacheEntry {
  values: SystemSettings;
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 60_000;

function invalidateCache() {
  cache = null;
}

/**
 * Đọc cấu hình hệ thống (cache 60s).
 * Dùng từ alerts service / JWT lib / layout v.v.
 */
export async function getCachedSettings(): Promise<SystemSettings> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.values;

  const rows = await prisma.systemSetting.findMany({
    where: { key: { in: KEYS } },
    select: { key: true, value: true },
  });
  const map = new Map(rows.map((r) => [r.key, r.value as unknown]));
  const values: SystemSettings = {
    general: mergeWithDefaults("general", map.get("general")),
    alerts: mergeWithDefaults("alerts", map.get("alerts")),
    security: mergeWithDefaults("security", map.get("security")),
    integrations: mergeWithDefaults("integrations", map.get("integrations")),
  };
  cache = { values, expiresAt: now + CACHE_TTL_MS };
  return values;
}

// ─────────────────────────────────────────
// QUERIES
// ─────────────────────────────────────────

const userSummarySelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

async function readGroup<K extends SettingsKeyInput>(
  key: K,
): Promise<{ value: GroupValue<K>; meta: SystemSettingMeta }> {
  const row = await prisma.systemSetting.findUnique({
    where: { key },
    include: { updatedBy: { select: userSummarySelect } },
  });
  return {
    value: mergeWithDefaults(key, row?.value),
    meta: {
      updatedAt: row?.updatedAt.toISOString() ?? null,
      updatedBy: row?.updatedBy ?? null,
    },
  };
}

function emptyMeta(): SystemSettingMeta {
  return { updatedAt: null, updatedBy: null };
}

export async function getAllSettings(): Promise<SystemSettingsResponse> {
  const rows = await prisma.systemSetting.findMany({
    where: { key: { in: KEYS } },
    include: { updatedBy: { select: userSummarySelect } },
  });
  const rowMap = new Map(rows.map((r) => [r.key, r]));
  const values: SystemSettings = {
    general: mergeWithDefaults("general", rowMap.get("general")?.value),
    alerts: mergeWithDefaults("alerts", rowMap.get("alerts")?.value),
    security: mergeWithDefaults("security", rowMap.get("security")?.value),
    integrations: mergeWithDefaults(
      "integrations",
      rowMap.get("integrations")?.value,
    ),
  };
  const meta: SystemSettingsMetaMap = {
    general: metaFromRow(rowMap.get("general")),
    alerts: metaFromRow(rowMap.get("alerts")),
    security: metaFromRow(rowMap.get("security")),
    integrations: metaFromRow(rowMap.get("integrations")),
  };
  return { values, meta };
}

function metaFromRow(
  row:
    | {
        updatedAt: Date;
        updatedBy: { id: string; name: string; email: string } | null;
      }
    | undefined,
): SystemSettingMeta {
  if (!row) return emptyMeta();
  return {
    updatedAt: row.updatedAt.toISOString(),
    updatedBy: row.updatedBy ?? null,
  };
}

export async function getSettingsByKey<K extends SettingsKeyInput>(key: K) {
  return readGroup(key);
}

// ─────────────────────────────────────────
// MUTATIONS
// ─────────────────────────────────────────

type UpdateInputMap = {
  general: UpdateGeneralSettingsSchemaInput;
  alerts: UpdateAlertSettingsSchemaInput;
  security: UpdateSecuritySettingsSchemaInput;
  integrations: UpdateIntegrationSettingsSchemaInput;
};

export async function updateSettings<K extends SettingsKeyInput>(
  key: K,
  input: UpdateInputMap[K],
  userId: string,
): Promise<{ value: GroupValue<K>; meta: SystemSettingMeta }> {
  const { value: current } = await readGroup(key);
  const merged = { ...current, ...(input as object) };

  const parsed = VALIDATORS[key].safeParse(merged);
  if (!parsed.success) {
    throw new AppError(
      "VALIDATION_ERROR",
      parsed.error.issues[0]?.message ?? "Dữ liệu cấu hình không hợp lệ",
    );
  }

  const value = parsed.data as unknown as Prisma.InputJsonValue;

  const row = await prisma.systemSetting.upsert({
    where: { key },
    update: { value, updatedById: userId },
    create: { key, value, updatedById: userId },
    include: { updatedBy: { select: userSummarySelect } },
  });

  invalidateCache();

  await logActivity({
    userId,
    action: "SYSTEM_SETTINGS_UPDATED",
    targetType: "SystemSetting",
    targetId: row.id,
    targetCode: key,
    detail: `Cập nhật cấu hình "${KEY_LABELS[key]}"`,
  });

  return {
    value: parsed.data as GroupValue<K>,
    meta: {
      updatedAt: row.updatedAt.toISOString(),
      updatedBy: row.updatedBy ?? null,
    },
  };
}

export async function resetSettings(
  userId: string,
): Promise<SystemSettingsResponse> {
  const rows = await prisma.$transaction(
    KEYS.map((key) =>
      prisma.systemSetting.upsert({
        where: { key },
        update: {
          value: DEFAULTS[key] as unknown as Prisma.InputJsonValue,
          updatedById: userId,
        },
        create: {
          key,
          value: DEFAULTS[key] as unknown as Prisma.InputJsonValue,
          updatedById: userId,
        },
        include: { updatedBy: { select: userSummarySelect } },
      }),
    ),
  );

  invalidateCache();

  await logActivity({
    userId,
    action: "SYSTEM_SETTINGS_RESET",
    targetType: "SystemSetting",
    targetCode: "all",
    detail: "Khôi phục toàn bộ cấu hình hệ thống về mặc định",
  });

  const rowMap = new Map(rows.map((r) => [r.key, r]));
  const meta: SystemSettingsMetaMap = {
    general: metaFromRow(rowMap.get("general")),
    alerts: metaFromRow(rowMap.get("alerts")),
    security: metaFromRow(rowMap.get("security")),
    integrations: metaFromRow(rowMap.get("integrations")),
  };
  return { values: DEFAULTS, meta };
}
