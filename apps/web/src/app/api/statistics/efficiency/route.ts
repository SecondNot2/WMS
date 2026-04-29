import { getStatisticsQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/statistics.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getStatisticsQuerySchema);
    return ok(await service.getEfficiency(query));
  },
);
