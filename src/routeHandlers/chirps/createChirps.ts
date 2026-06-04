import { NextFunction, Request, Response } from "express";
import { validateChirp } from "../validateChirp.js";
import { createChirp } from "../../db/queries/chirps.js";

export async function chirpsHandler(req: Request, res: Response, next: NextFunction) {
 const validatedChirp = await validateChirp(req, res, next);
 if (!validatedChirp || !validatedChirp.cleanedBody) {
    console.error("Chirp validation failed");
   return; // If validation fails, the response has already been sent
 }
 const createdChirp = await createChirp({
   userId: req.body.userId,
   body: validatedChirp.cleanedBody,
 });
 res.status(201).json(createdChirp);
}

