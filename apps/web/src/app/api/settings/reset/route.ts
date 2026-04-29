import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/settings.service";

export const POST = handle({ roles: ["ADMIN"] }, async (_req, { user }) =>
  ok(await service.resetSettings(user!.id)),
);
