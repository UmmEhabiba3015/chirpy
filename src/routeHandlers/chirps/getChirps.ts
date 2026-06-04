import { NextFunction, Request, Response } from "express";
import { getChirpById, getChirps } from "../../db/queries/chirps.js";
import { errorHandler, NotFoundError } from "../../middleware/errorHandler.middleware.js";

export async function getChirpsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const chirps = await getChirps();
    res.status(200).json(chirps);
  } catch (err) {
    next(err);
  }
}

export async function getChirpByIdHandler(req: Request, res: Response, next: NextFunction) {
    const chirpId = req.params.chirpId;
    try{ 
        const chirp = await getChirpById(chirpId as string);
        if (!chirp) {
            errorHandler( new NotFoundError(`Chirp with id ${chirpId} not found`), req, res, next);
            return;
        }
        res.status(200).json(chirp);
    }catch (err) {
        next(err);
    }
}