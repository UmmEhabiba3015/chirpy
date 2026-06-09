import { Request, Response, NextFunction } from "express";
import { getUserByEmail } from "../../db/queries/users.js";
import {
  getBearerToken,
  makeJWT,
  makeRefreshToken,
  verifyPassword,
} from "../../auth/auth.js";
import {
  errorHandler,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import config from "../../config.js";
import { createRefreshToken } from "../../db/queries/tokens.js";

export async function userLoginHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    errorHandler(
      new UnauthorizedError("User not found, incorrect email"),
      req,
      res,
      next,
    );
    return;
  }

  const isValid = await verifyPassword(password, user.hashedPassword);
  if (!isValid) {
    errorHandler(new UnauthorizedError("Invalid password"), req, res, next);
    return;
  }

  let jwtExpiry: number = 3600;
  const jwt = makeJWT(user.id, jwtExpiry, config.secret);

  
  const refreshToken = makeRefreshToken();
  const refreshTokenExpiresAt = new Date();
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 60);
  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: refreshTokenExpiresAt,
  });

  const resBody = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: jwt,
    refreshToken: refreshToken,
    isChirpyRed: user.isChirpyRed 
  };
  res.status(200).json(resBody);
}
