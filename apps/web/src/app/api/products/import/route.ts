import { AppError } from "@/server/lib/errors";
import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/products.service";

export const POST = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF"] },
  async (req) => {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new AppError("VALIDATION_ERROR", "Vui lòng chọn file Excel");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await service.importProducts(buffer);
    return ok(result);
  },
);
