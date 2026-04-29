import * as XLSX from "xlsx";
import { excelResponse, handle } from "@/server/middleware/handler";
import * as service from "@/server/services/reports.service";

interface ExportQuery {
  type: "inventory" | "receipt-issue" | "top-products";
  from?: string;
  to?: string;
  date?: string;
  categoryId?: string;
  supplierId?: string;
  recipientId?: string;
  topType?: "IN" | "OUT";
  limit?: number;
}

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query: ExportQuery = {
      ...params,
      limit: params.limit ? Number(params.limit) : undefined,
    } as ExportQuery;

    const wb = XLSX.utils.book_new();

    if (query.type === "inventory") {
      const data = await service.getInventory({
        date: query.date,
        categoryId: query.categoryId,
        page: 1,
        limit: query.limit ?? 100,
      });
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
          {
            "Tổng giá trị tồn": data.summary.totalValue,
            "SKU hiện có": data.summary.skuCount,
            "Đã hết hàng": data.summary.outOfStock,
            "Tỉ lệ lấp đầy (%)": data.summary.fillRate,
          },
        ]),
        "Tổng hợp",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          data.items.map((item, idx) => ({
            STT: idx + 1,
            SKU: item.sku,
            "Tên sản phẩm": item.name,
            "Danh mục": item.category,
            "Tồn cuối": item.stock,
            ĐVT: item.unit,
            "Giá nhập TB": item.avgPrice,
            "Tổng giá trị": item.totalValue,
          })),
        ),
        "Tồn kho",
      );
    } else if (query.type === "receipt-issue") {
      const data = await service.getReceiptIssue({
        from: query.from,
        to: query.to,
        supplierId: query.supplierId,
        recipientId: query.recipientId,
        page: 1,
        limit: query.limit ?? 100,
      });
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
          {
            "Tổng nhập kho": data.summary.totalInbound,
            "Tổng xuất kho": data.summary.totalOutbound,
            "Giá trị nhập": data.summary.inboundAmount,
            "Giá trị xuất": data.summary.outboundAmount,
          },
        ]),
        "Tổng hợp",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          data.items.map((item, idx) => ({
            STT: idx + 1,
            Ngày: item.date,
            Loại: item.type,
            "Mã phiếu": item.code,
            "Sản phẩm": item.item,
            "Số lượng": item.qty,
            "Giá trị": item.value,
          })),
        ),
        "Biến động",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          data.chart.map((item) => ({
            Ngày: item.label,
            "Phiếu nhập": item.inbound,
            "Phiếu xuất": item.outbound,
          })),
        ),
        "Biểu đồ",
      );
    } else {
      const data = await service.getTopProducts({
        from: query.from,
        to: query.to,
        type: query.topType ?? "IN",
        limit: query.limit ?? 100,
      });
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
          {
            "Sản phẩm phân tích": data.summary.analyzedProducts,
            "Luân chuyển cao": data.summary.highTurnover,
            "Luân chuyển thấp": data.summary.lowTurnover,
            "Tỷ lệ trung bình (%)": data.summary.averageTurnoverRate,
          },
        ]),
        "Tổng hợp",
      );
      XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(
          data.items.map((item) => ({
            Hạng: item.rank,
            SKU: item.sku,
            "Tên sản phẩm": item.name,
            "Danh mục": item.category,
            Nhập: item.inboundQty,
            Xuất: item.outboundQty,
            Tồn: item.stock,
            "Tỷ lệ luân chuyển (%)": item.turnoverRate,
            "Xu hướng": item.trend,
          })),
        ),
        "Top sản phẩm",
      );
    }

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return excelResponse(
      buffer,
      `reports-${query.type}-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },
);
