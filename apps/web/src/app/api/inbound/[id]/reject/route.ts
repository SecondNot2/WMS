import { rejectInboundSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/inbound.service";

export const POST = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const body = await parseBody(req, rejectInboundSchema);
    return ok(await service.rejectInbound(params.id, body.reason, user!.id));
  },
);
