import { createUserSchema, getUsersQuerySchema } from "@wms/validations";
import {
  created,
  handle,
  ok,
  parseBody,
  parseQuery,
} from "@/server/middleware/handler";
import * as service from "@/server/services/users.service";

export const GET = handle({ roles: ["ADMIN"] }, async (req) => {
  const query = parseQuery(req, getUsersQuerySchema);
  const result = await service.getUsers(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: ["ADMIN"] }, async (req) => {
  const body = await parseBody(req, createUserSchema);
  return created(await service.createUser(body));
});
