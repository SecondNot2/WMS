import {
  createRecipientSchema,
  getRecipientsQuerySchema,
} from "@wms/validations";
import {
  created,
  handle,
  ok,
  parseBody,
  parseQuery,
} from "@/server/middleware/handler";
import * as service from "@/server/services/recipients.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle({ roles: READ }, async (req) => {
  const query = parseQuery(req, getRecipientsQuerySchema);
  const result = await service.getRecipients(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: WRITE }, async (req, { user }) => {
  const body = await parseBody(req, createRecipientSchema);
  return created(await service.createRecipient(body, user!.id));
});
