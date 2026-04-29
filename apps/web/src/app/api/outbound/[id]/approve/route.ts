import { handle, ok } from "@/server/middleware/handler";
import * as service from "@/server/services/outbound.service";

export const POST = handle<{ id: string }>(
  { roles: ["ADMIN"] },
  async (_req, { params, user }) =>
    ok(await service.approveOutbound(params.id, user!.id)),
);
