import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/inbound.service";

export const POST = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params, user }) =>
    ok(await service.approveInbound(params.id, user!.id)),
);
