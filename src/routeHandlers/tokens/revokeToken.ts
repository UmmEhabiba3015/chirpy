import { Request, Response, NextFunction } from "express";
import { getBearerToken } from "../../auth/auth.js";
import { getToken, revokeToken } from "../../db/queries/tokens.js";
import {
  errorHandler,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";

export async function revokeTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken = getBearerToken(req);
    const tokenRecord = await getToken(refreshToken);
    if (!tokenRecord) {
      return errorHandler(
        new UnauthorizedError("No token record"),
        req,
        res,
        next,
      );
    }
    await revokeToken(refreshToken);
    res.status(204).send();
  } catch {
    errorHandler(new UnauthorizedError(""), req, res, next);
  }
}
