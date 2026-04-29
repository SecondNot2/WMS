import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/auth.service";

export const GET = handle({ authenticated: true }, async (_req, { user }) => {
  const result = await service.getMe(user!.id);
  return ok(result);
});
