import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/inventory.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async () => ok(await service.getInventorySummary()),
);
