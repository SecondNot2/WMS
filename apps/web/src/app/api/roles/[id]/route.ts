import { updateRoleSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/roles.service";

export const GET = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params }) => ok(await service.getRoleById(params.id)),
);

export const PATCH = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { params }) => {
    const body = await parseBody(req, updateRoleSchema);
    return ok(await service.updateRole(params.id, body));
  },
);

export const DELETE = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params }) => {
    await service.deleteRole(params.id);
    return ok({ message: "Đã xóa vai trò" });
  },
);
