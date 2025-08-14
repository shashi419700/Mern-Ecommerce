import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utlity-class.js";
import { ControllerType } from "../types/type.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "eevvvdx";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID";

  return res.status(err.statusCode).json({
    success: true,
    message: err.message,
  });
};

export const Trycatch = (fun: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fun(req, res, next)).catch(next);
  };
};
