import type { NextFunction, Request, Response } from "express";
import * as XLSX from "xlsx";
import * as service from "../services/statistics.service";

function sendWorkbook(
  res: Response,
  workbook: XLSX.WorkBook,
  filename: string,
) {
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}

export const getEfficiency = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await service.getEfficiency(req.query as never);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await service.getPerformance(req.query as never);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const exportExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [efficiency, performance] = await Promise.all([
      service.getEfficiency(req.query as never),
      service.getPerformance(req.query as never),
    ]);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
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
      workbook,
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
      workbook,
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
      workbook,
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
      workbook,
      XLSX.utils.json_to_sheet(
        performance.categoryDistribution.map((item) => ({
          "Danh mục": item.name,
          "Giá trị": item.value,
        })),
      ),
      "Danh mục",
    );

    sendWorkbook(
      res,
      workbook,
      `statistics-${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  } catch (error) {
    next(error);
  }
};
