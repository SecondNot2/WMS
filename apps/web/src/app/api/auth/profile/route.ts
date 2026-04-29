import { updateProfileSchema } from "@wms/validations";
import { handle, parseBody, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/auth.service";

export const PATCH = handle({ authenticated: true }, async (req, { user }) => {
  const body = await parseBody(req, updateProfileSchema);
  const result = await service.updateProfile(user!.id, body);
  return ok(result);
});
