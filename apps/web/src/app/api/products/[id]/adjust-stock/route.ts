import { adjustStockSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/products.service";

export const POST = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { user, params }) => {
    const body = await parseBody(req, adjustStockSchema);
    const product = await service.adjustStock(params.id, body, user!.id);
    return ok(product);
  },
);
