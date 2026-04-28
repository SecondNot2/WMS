import type { Request, Response, NextFunction } from "express";
import * as XLSX from "xlsx";
import { AppError } from "../lib/errors";
import * as service from "../services/inbound.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await service.getInbounds(req.query as never);
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
    const stats = await service.getInboundStats();
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
    const data = await service.getInboundById(req.params.id);
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
    const data = await service.createInbound(req.body, req.user.id);
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
    const data = await service.updateInbound(
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
    await service.deleteInbound(req.params.id, req.user.id);
    res.json({ success: true, data: { message: "Đã xóa phiếu nhập" } });
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
    const receipts = await service.exportInbounds(req.query as never);

    const summaryRows = receipts.map((r, idx) => ({
      STT: idx + 1,
      "Mã phiếu": r.code,
      "Nhà cung cấp": r.supplier.name,
      "Mã số thuế": r.supplier.taxCode ?? "",
      "Trạng thái": STATUS_LABEL[r.status] ?? r.status,
      "Số mặt hàng": r.items.length,
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
    const filename = `inbound-${new Date().toISOString().slice(0, 10)}.xlsx`;

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
    const data = await service.approveInbound(req.params.id, req.user.id);
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
    const data = await service.rejectInbound(
      req.params.id,
      req.body.reason,
      req.user.id,
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
