import { Request, Response, NextFunction } from "express";
import { getBearerToken, makeJWT, validateJWT } from "../../auth/auth.js";
import {
  errorHandler,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import config from "../../config.js";
import { getUserFromRefreshToken } from "../../db/queries/tokens.js";

export async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = getBearerToken(req);
  const user = await getUserFromRefreshToken(refreshToken, req, res, next);
  if (!user) {
    throw errorHandler(new UnauthorizedError("No user with this token"), req, res, next);
  }
  let jwtExpiry: number = 3600;
  const jwt = makeJWT(user.id, jwtExpiry, config.secret);
  res.status(200).json({
    token: jwt,
  });
}
