import { updateProductSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/products.service";

const READ_ROLES = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE_ROLES = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle<{ id: string }>(
  { roles: READ_ROLES },
  async (_req, { params }) => {
    const product = await service.getProductById(params.id);
    return ok(product);
  },
);

export const PATCH = handle<{ id: string }>(
  { roles: WRITE_ROLES },
  async (req, { params }) => {
    const body = await parseBody(req, updateProductSchema);
    const product = await service.updateProduct(params.id, body);
    return ok(product);
  },
);

export const DELETE = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params }) => {
    await service.deleteProduct(params.id);
    return ok({ message: "Đã xóa sản phẩm" });
  },
);
