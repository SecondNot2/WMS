import { updateUserSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/users.service";

export const GET = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params }) => ok(await service.getUserById(params.id)),
);

export const PATCH = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const body = await parseBody(req, updateUserSchema);
    return ok(await service.updateUser(params.id, body, user!.id));
  },
);

export const DELETE = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params, user }) => {
    await service.deleteUser(params.id, user!.id);
    return ok({ message: "Đã xóa người dùng" });
  },
);
