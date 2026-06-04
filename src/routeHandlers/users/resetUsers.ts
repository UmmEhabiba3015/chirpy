import { Request, Response, NextFunction } from "express";
import { resetUsers } from "../../db/queries/users.js";
import config from "../../config.js";
import {
  errorHandler,
  ForbiddenError,
} from "../../middleware/errorHandler.middleware.js";

export async function resetUsersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (config.api.platform !== "dev") {
    errorHandler(
      new ForbiddenError(
        "Reset users endpoint is only available in dev environment",
      ),
      req,
      res,
      next,
    );
    return;
  }
  await resetUsers();
  res.status(200).json({ message: "Users reset successfully" });
}
