import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/alerts.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async () => ok(await service.getAlertStats()),
);
