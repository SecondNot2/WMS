import { loginSchema } from "@wms/validations";
import { handle, parseBody, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/auth.service";

export const POST = handle(async (req) => {
  const body = await parseBody(req, loginSchema);
  const result = await service.login(body);
  return ok(result);
});
