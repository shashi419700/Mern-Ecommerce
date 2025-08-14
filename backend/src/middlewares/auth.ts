import { User } from "../models/user.js";
import ErrorHandler from "../utils/utlity-class.js";
import { Trycatch } from "./error.js";

//Middleware to make sure only admin is allowed
export const adminOnly = Trycatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Saale Login kar phale", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Saale Fake Id daalta hai", 401));

  if(user.role !== "admin")
    return next(new ErrorHandler("Saale Aukkad Nahi hai teri ", 401));
  next();
});
