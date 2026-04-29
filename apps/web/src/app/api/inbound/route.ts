import {
  createInboundSchema,
  getInboundsQuerySchema,
} from "@wms/validations";
import { created, handle, ok, parseBody, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/inbound.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle({ roles: READ }, async (req) => {
  const query = parseQuery(req, getInboundsQuerySchema);
  const result = await service.getInbounds(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: WRITE }, async (req, { user }) => {
  const body = await parseBody(req, createInboundSchema);
  return created(await service.createInbound(body, user!.id));
});
