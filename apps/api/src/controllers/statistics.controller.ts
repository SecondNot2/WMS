import type { NextFunction, Request, Response } from "express";
import * as service from "../services/statistics.service";

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
