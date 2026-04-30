import { createProductSchema, getProductsQuerySchema } from "@wms/validations";
import {
  created,
  handle,
  ok,
  parseBody,
  parseQuery,
} from "@/server/middleware/handler";
import * as service from "@/server/services/products.service";

const READ_ROLES = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE_ROLES = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle({ roles: READ_ROLES }, async (req) => {
  const query = parseQuery(req, getProductsQuerySchema);
  const result = await service.getProducts(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: WRITE_ROLES }, async (req) => {
  const body = await parseBody(req, createProductSchema);
  const product = await service.createProduct(body);
  return created(product);
});
