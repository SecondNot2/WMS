import { changePasswordSchema } from "@wms/validations";
import { handle, parseBody, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/auth.service";

export const PATCH = handle({ authenticated: true }, async (req, { user }) => {
  const body = await parseBody(req, changePasswordSchema);
  await service.changePassword(user!.id, body);
  return ok({ message: "Đổi mật khẩu thành công" });
});
