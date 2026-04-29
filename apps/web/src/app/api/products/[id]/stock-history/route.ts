import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/products.service";

export const GET = handle<{ id: string }>(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (_req, { params }) => {
    const history = await service.getProductStockHistory(params.id);
    return ok(history);
  },
);
