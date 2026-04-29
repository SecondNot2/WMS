import { getAlertsQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/alerts.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getAlertsQuerySchema);
    const result = await service.getAlerts(query);
    return ok(result.data, { meta: result.meta });
  },
);
