import { getInventoryQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/inventory.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getInventoryQuerySchema);
    const result = await service.getInventory(query);
    return ok(result.data, { meta: result.meta });
  },
);
