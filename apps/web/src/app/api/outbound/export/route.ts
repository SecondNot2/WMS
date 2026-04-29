import * as XLSX from "xlsx";
import { getOutboundsQuerySchema } from "@wms/validations";
import { excelResponse, handle, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/outbound.service";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getOutboundsQuerySchema);
    const issues = await service.exportOutbounds(query);

    const summaryRows = issues.map((r, idx) => ({
      STT: idx + 1,
      "Mã phiếu": r.code,
      "Đơn vị nhận": r.recipient.name,
      "Lý do xuất": r.purpose ?? "",
      "Trạng thái": STATUS_LABEL[r.status] ?? r.status,
      "Số mặt hàng": r.items.length,
      "Tổng tiền (VND)": Number(r.totalAmount),
      "Người lập": r.createdBy.name,
      "Ngày lập": r.createdAt.toISOString(),
      "Ngày xuất kho": r.issuedAt ? r.issuedAt.toISOString() : "",
      "Lý do từ chối": r.rejectedReason ?? "",
      "Ghi chú": r.note ?? "",
    }));

    const detailRows = issues.flatMap((r) =>
      r.items.map((item) => ({
        "Mã phiếu": r.code,
        "Đơn vị nhận": r.recipient.name,
        "Trạng thái": STATUS_LABEL[r.status] ?? r.status,
        SKU: item.product.sku,
        "Tên sản phẩm": item.product.name,
        ĐVT: item.product.unit,
        "Số lượng": item.quantity,
        "Đơn giá": Number(item.unitPrice),
        "Thành tiền": Number(item.totalPrice),
        "Ngày lập": r.createdAt.toISOString(),
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), "Tổng hợp");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailRows), "Chi tiết");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return excelResponse(buffer, `outbound-${new Date().toISOString().slice(0, 10)}.xlsx`);
  },
);
