import { Request, Response, NextFunction } from "express";
import {
  errorHandler,
  BadRequestError,
} from "../../middleware/errorHandler.middleware.js";
import { createUser } from "../../db/queries/users.js";
import { hashPassword } from "../../auth/auth.js";

type CreateUserRequestBody = {
  email: string;
  password: string;
};

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body as CreateUserRequestBody;

  if (!email) {
    errorHandler(new BadRequestError("Email is required"), req, res, next);
    return;
  }
  if (!password) {
    errorHandler(new BadRequestError("Password is required"), req, res, next);
    return;
  }
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({ email, hashedPassword });
    const resBody = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      isChirpyRed: newUser.isChirpyRed
    };
    res.status(201).json(resBody);
  } catch (err) {
    next(err);
    return;
  }
}
