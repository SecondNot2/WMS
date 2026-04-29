import { rejectOutboundSchema } from "@wms/validations";
import { handle, ok, parseBody } from "@/server/middleware/handler";
import * as service from "@/server/services/outbound.service";

export const POST = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (req, { params, user }) => {
    const body = await parseBody(req, rejectOutboundSchema);
    return ok(await service.rejectOutbound(params.id, body.reason, user!.id));
  },
);
