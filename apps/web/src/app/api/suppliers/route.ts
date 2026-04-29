import {
  createSupplierSchema,
  getSuppliersQuerySchema,
} from "@wms/validations";
import { created, handle, ok, parseBody, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/suppliers.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle({ roles: READ }, async (req) => {
  const query = parseQuery(req, getSuppliersQuerySchema);
  const result = await service.getSuppliers(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: WRITE }, async (req, { user }) => {
  const body = await parseBody(req, createSupplierSchema);
  return created(await service.createSupplier(body, user!.id));
});
