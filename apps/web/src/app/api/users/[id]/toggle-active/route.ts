import { toggleUserActiveSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/users.service";

export const PATCH = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const body = await parseBody(req, toggleUserActiveSchema);
    return ok(
      await service.toggleUserActive(params.id, body.isActive, user!.id),
    );
  },
);
