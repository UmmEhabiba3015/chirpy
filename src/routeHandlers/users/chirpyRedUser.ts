import { Request, Response, NextFunction } from "express";
import { updateUsersToChirpyRed } from "../../db/queries/users.js";
import {
  errorHandler,
  NotFoundError,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import { getAPIKey } from "../../auth/auth.js";
import config from "../../config.js";

export async function ChirpyRedUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const APIKey = getAPIKey(req);
    if (APIKey !== config.polkaKey) {
      errorHandler(new UnauthorizedError("Wrong Polka Key"), req, res, next);
      return;
    }
  } catch (error) {
    errorHandler(new UnauthorizedError("Unauthorized"), req, res, next);
    return;
  }

  try {
    const body = req.body;
    if (body.event !== "user.upgraded") {
      res.status(204).send();
      return;
    }
    const userId = body.data.userId;
    const updateUser = await updateUsersToChirpyRed(userId as string);
    if (!updateUser) {
      errorHandler(new NotFoundError("User not found"), req, res, next);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
