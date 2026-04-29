import { updateCategorySchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/categories.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle<{ id: string }>(
  { roles: READ },
  async (_req, { params }) => ok(await service.getCategoryById(params.id)),
);

export const PATCH = handle<{ id: string }>(
  { roles: WRITE },
  async (req, { params }) => {
    const body = await parseBody(req, updateCategorySchema);
    return ok(await service.updateCategory(params.id, body));
  },
);

export const DELETE = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params }) => {
    await service.deleteCategory(params.id);
    return ok({ message: "Đã xóa danh mục" });
  },
);
