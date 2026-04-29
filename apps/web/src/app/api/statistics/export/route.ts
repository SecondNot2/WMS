import * as XLSX from "xlsx";
import { getStatisticsQuerySchema } from "@wms/validations";
import { excelResponse, handle, parseQuery } from "@/server/middleware/handler";
import * as service from "@/server/services/statistics.service";

export const GET = handle(
  { roles: ["ADMIN", "WAREHOUSE_STAFF", "ACCOUNTANT"] },
  async (req) => {
    const query = parseQuery(req, getStatisticsQuerySchema);
    const [efficiency, performance] = await Promise.all([
      service.getEfficiency(query),
      service.getPerformance(query),
    ]);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet([
        {
          "Tổng nhập kho": performance.summary.totalInbound.value,
          "Xu hướng nhập (%)": performance.summary.totalInbound.trend,
          "Tổng xuất kho": performance.summary.totalOutbound.value,
          "Xu hướng xuất (%)": performance.summary.totalOutbound.trend,
          "Giá trị tồn kho": performance.summary.inventoryValue.value,
          "Sản phẩm hoạt động": performance.summary.activeProducts.value,
        },
      ]),
      "Tổng hợp",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet([
        {
          "Tỷ lệ phê duyệt (%)": efficiency.approvalRate,
          "Thời gian duyệt TB (giờ)": efficiency.avgApprovalTime,
          "Độ chính xác tồn kho (%)": efficiency.stockAccuracy,
          "Vòng quay tồn kho": efficiency.turnoverRate,
          "Hoàn tất nhập (%)": efficiency.inboundFulfillmentRate,
          "Hoàn tất xuất (%)": efficiency.outboundFulfillmentRate,
        },
      ]),
      "Hiệu suất",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        performance.flowSeries.map((item) => ({
          Ngày: item.label,
          Nhập: item.inbound,
          Xuất: item.outbound,
        })),
      ),
      "Luồng nhập xuất",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        performance.topProducts.map((item, idx) => ({
          STT: idx + 1,
          SKU: item.sku,
          "Tên sản phẩm": item.name,
          "Số lượng": item.quantity,
        })),
      ),
      "Top sản phẩm",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(
        performance.categoryDistribution.map((item) => ({
          "Danh mục": item.name,
          "Giá trị": item.value,
        })),
      ),
      "Danh mục",
    );

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
    return excelResponse(
      buffer,
      `statistics-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  },
);
