import { createRoleSchema } from "@wms/validations";
import { created, handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/roles.service";

export const GET = handle({ roles: ["ADMIN"] }, async () =>
  ok(await service.getRoles()),
);

export const POST = handle({ roles: ["ADMIN"] }, async (req) => {
  const body = await parseBody(req, createRoleSchema);
  return created(await service.createRole(body));
});
