import { updateOutboundSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/outbound.service";

const READ = ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"];
const WRITE = ["ADMIN", "WAREHOUSE_STAFF"];

export const GET = handle<{ id: string }>(
  { roles: READ },
  async (_req, { params }) => ok(await service.getOutboundById(params.id)),
);

export const PATCH = handle<{ id: string }>(
  { roles: WRITE },
  async (req, { params, user }) => {
    const body = await parseBody(req, updateOutboundSchema);
    return ok(await service.updateOutbound(params.id, body, user!.id));
  },
);

export const DELETE = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params, user }) => {
    await service.deleteOutbound(params.id, user!.id);
    return ok({ message: "Đã xóa phiếu xuất" });
  },
);
