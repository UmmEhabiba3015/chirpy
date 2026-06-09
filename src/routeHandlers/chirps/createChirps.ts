import { NextFunction, Request, Response } from "express";
import { validateChirp } from "../validateChirp.js";
import { createChirp } from "../../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../../auth/auth.js";
import config from "../../config.js";
import {
  errorHandler,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";

export async function chirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let userId: string = "";
  try {
    const jwt = getBearerToken(req);
    userId = validateJWT(jwt, config.secret);
    const validatedChirp = await validateChirp(req, res, next);
    if (!validatedChirp || !validatedChirp.cleanedBody) {
      console.error("Chirp validation failed");
      return; // If validation fails, the response has already been sent
    }
    const createdChirp = await createChirp({
      userId: userId,
      body: validatedChirp.cleanedBody,
    });
    res.status(201).json(createdChirp);
  } catch {
    errorHandler(new UnauthorizedError("Invalid JWT"), req, res, next);
  }
}
