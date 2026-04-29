import {
  createCategorySchema,
  getCategoriesQuerySchema,
} from "@wms/validations";
import { created, handle, ok, parseBody, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/categories.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle({ roles: READ }, async (req) => {
  const query = parseQuery(req, getCategoriesQuerySchema);
  const result = await service.getCategories(query);
  return ok(result.data, { meta: result.meta });
});

export const POST = handle({ roles: WRITE }, async (req) => {
  const body = await parseBody(req, createCategorySchema);
  const data = await service.createCategory(body);
  return created(data);
});
