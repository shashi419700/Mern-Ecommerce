import { User } from "../models/user.js";
import ErrorHandler from "../utils/utlity-class.js";
import { Trycatch } from "./error.js";

// Middleware to ensure only admin is allowed
export const adminOnly = Trycatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please login first.", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid user ID.", 401));

  if (user.role !== "admin")
    return next(new ErrorHandler("Access denied. Admin privileges required.", 403));

  next();
});
