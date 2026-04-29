import { getTopProductsReportQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/reports.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getTopProductsReportQuerySchema);
    return ok(await service.getTopProducts(query));
  },
);
