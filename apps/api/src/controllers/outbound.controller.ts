import type { Request, Response, NextFunction } from "express";
import * as XLSX from "xlsx";
import { AppError } from "../lib/errors";
import * as service from "../services/outbound.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await service.getOutbounds(req.query as never);
    res.json({ success: true, data: result.data, meta: result.meta });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await service.getOutboundStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await service.getOutboundById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
    const data = await service.createOutbound(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
    const data = await service.updateOutbound(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
    await service.deleteOutbound(req.params.id, req.user.id);
    res.json({ success: true, data: { message: "Đã xóa phiếu xuất" } });
  } catch (error) {
    next(error);
  }
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const exportExcel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issues = await service.exportOutbounds(req.query as never);

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

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(summaryRows),
      "Tổng hợp",
    );
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(detailRows),
      "Chi tiết",
    );

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    const filename = `outbound-${new Date().toISOString().slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
    const data = await service.approveOutbound(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const reject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("UNAUTHORIZED", "Chưa đăng nhập");
    const data = await service.rejectOutbound(
      req.params.id,
      req.body.reason,
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
