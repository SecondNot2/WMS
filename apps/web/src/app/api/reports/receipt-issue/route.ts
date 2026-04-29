import { getReceiptIssueReportQuerySchema } from "@wms/validations";
import { handle, ok, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/reports.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getReceiptIssueReportQuerySchema);
    return ok(await service.getReceiptIssue(query));
  },
);
