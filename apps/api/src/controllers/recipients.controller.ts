import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors";
import * as service from "../services/recipients.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await service.getRecipients(req.query as never);
    res.json({ success: true, data: result.data, meta: result.meta });
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
    const recipient = await service.getRecipientById(req.params.id);
    res.json({ success: true, data: recipient });
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
    const recipient = await service.createRecipient(req.body, req.user.id);
    res.status(201).json({ success: true, data: recipient });
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
    const recipient = await service.updateRecipient(
      req.params.id,
      req.body,
      req.user.id,
    );
    res.json({ success: true, data: recipient });
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
    await service.deleteRecipient(req.params.id, req.user.id);
    res.json({ success: true, data: { message: "Đã xóa đơn vị nhận" } });
  } catch (error) {
    next(error);
  }
};
