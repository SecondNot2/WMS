import { adjustStockSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/inventory.service";

export const POST = handle<{ productId: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const body = await parseBody(req, adjustStockSchema);
    return ok(
      await service.adjustInventoryStock(params.productId, body, user!.id),
    );
  },
);
