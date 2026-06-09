import { Request, Response, NextFunction } from "express";
import { getBearerToken, validateJWT } from "../../auth/auth.js";
import {
  errorHandler,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import config from "../../config.js";
import { validateChirp } from "../validateChirp.js";
import { deleteChirpsById, getChirpById } from "../../db/queries/chirps.js";

export async function deleteChirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let token: string = "";
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

    let userID: string = "";
    try {
      userID = validateJWT(token, config.secret);
    } catch {
      errorHandler(new UnauthorizedError("Invalid Token"), req, res, next);
      return;
    }

    const chirpId = req.params.chirpId;
    const chirp = await getChirpById(chirpId as string);
    if(!chirp){
        errorHandler(new NotFoundError("Chirp Not Found"),req, res,next);
        return
    }
    if(chirp.userId !== userID){
        errorHandler(new ForbiddenError("forbidden"),req,res,next);
        return
    }

    try {
      await deleteChirpsById(chirpId as string);
      res.status(204).send();
    } catch {
      errorHandler(
        new UnauthorizedError("Chirp cannot be deleted"),
        req,
        res,
        next,
      );
    }
  } catch (err) {
    next(err);
  }
}
