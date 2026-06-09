import { Request, Response, NextFunction } from "express";
import { getBearerToken, hashPassword, validateJWT } from "../../auth/auth.js";
import {
  errorHandler,
  BadRequestError,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import { updateUsers } from "../../db/queries/users.js";
import config from "../../config.js";

export async function updateUserInfoHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    if (!email) {
      errorHandler(new BadRequestError("Email is required"), req, res, next);
      return;
    }

    if (!password) {
      errorHandler(new BadRequestError("Password is required"), req, res, next);
      return;
    }

    let token: string;

    try {
      token = getBearerToken(req);
    } catch {
      errorHandler(
        new UnauthorizedError("Access Token missing"),
        req,
        res,
        next,
      );
      return;
    }

    let userID: string;

    try {
      userID = validateJWT(token, config.secret);
    } catch {
      errorHandler(
        new UnauthorizedError("Invalid or expired access token"),
        req,
        res,
        next,
      );
      return;
    }

    const hashedPassword = await hashPassword(password);

    const userUpdate = await updateUsers(userID, email, hashedPassword);

    if (!userUpdate) {
      errorHandler(
        new BadRequestError("User cannot be updated"),
        req,
        res,
        next,
      );
      return;
    }

    res.status(200).json(userUpdate);
  } catch (err) {
    next(err);
  }
}
