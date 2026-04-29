import { refreshTokenSchema } from "@wms/validations";
import { handle, parseBody, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/auth.service";

export const POST = handle(async (req) => {
  const body = await parseBody(req, refreshTokenSchema);
  const result = await service.refresh(body);
  return ok(result);
});
