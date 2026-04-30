import * as XLSX from "xlsx";
import { getInboundsQuerySchema } from "@wms/validations";
import { excelResponse, handle, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/inbound.service";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getInboundsQuerySchema);
    const receipts = await service.exportInbounds(query);

    const summaryRows = receipts.map((r, idx) => ({
      STT: idx + 1,
      "Mã phiếu": r.code,
      "Nhà cung cấp": r.supplier.name,
      "Mã số thuế": r.supplier.taxCode ?? "",
      "Trạng thái": STATUS_LABEL[r.status] ?? r.status,
      "Số mặt hàng": r.items.length,
      "Tạm tính (VND)": Number(r.subtotalAmount),
      "Tổng VAT (VND)": Number(r.taxTotalAmount),
      "Tổng tiền (VND)": Number(r.totalAmount),
      "Người lập": r.createdBy.name,
      "Ngày lập": r.createdAt.toISOString(),
      "Ngày duyệt": r.receivedAt ? r.receivedAt.toISOString() : "",
      "Lý do từ chối": r.rejectedReason ?? "",
      "Ghi chú": r.note ?? "",
    }));

    const detailRows = receipts.flatMap((r) =>
      r.items.map((item) => ({
        "Mã phiếu": r.code,
        "Nhà cung cấp": r.supplier.name,
        "Trạng thái": STATUS_LABEL[r.status] ?? r.status,
        SKU: item.product.sku,
        "Tên sản phẩm": item.product.name,
        ĐVT: item.product.unit,
        "Số lượng": item.quantity,
        "Đơn giá": Number(item.unitPrice),
        "Thuế (%)": Number(item.taxRate),
        "Tiền thuế": Number(item.taxAmount),
        "Thành tiền": Number(item.totalPrice),
        "Ngày lập": r.createdAt.toISOString(),
      })),
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(summaryRows),
      "Tổng hợp",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(detailRows),
      "Chi tiết",
    );

    const buffer = XLSX.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    }) as Buffer;
    return excelResponse(
      buffer,
      `inbound-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },
);
