import { getActivityLogsQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/activityLog.service";

export const GET = handle({ roles: ["ADMIN"] }, async (req) => {
  const query = parseQuery(req, getActivityLogsQuerySchema);
  const result = await service.getActivityLogs(query);
  return ok(result.data, { meta: result.meta });
});
