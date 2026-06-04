import { Request, Response, NextFunction } from "express";
import {
  errorHandler,
  BadRequestError,
} from "../../middleware/errorHandler.middleware.js";
import { createUser } from "../../db/queries/users.js";

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email = req.body.email;
  if (!email) {
    errorHandler(new BadRequestError("Email is required"), req, res, next);
    return;
  }
  try {
    const newUser = await createUser({ email });
    const resBody = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    res.status(201).json(resBody);
  } catch (err) {
    next(err);
    return;
  }
}
