import { Request, Response, NextFunction } from "express";
import { errorHandler, BadRequestError } from "../middleware/errorHandler.middleware.js";

export async function validateChirp(req: Request, res: Response, next: NextFunction) {
  type resBody = {
    error?: string;
    cleanedBody?: string;
  };

  type reqBody = {
    body: string;
  };
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const parsedBody: reqBody = req.body;

  try {
    if (parsedBody.body.length > 140) {
      errorHandler(new BadRequestError("Chirp is too long. Max length is 140"), req, res, next);
      return;
    }

    const cleanedBody = parsedBody.body
      .split(" ")
      .map((word) => {
        if (profaneWords.includes(word.toLowerCase())) {
          return "****";
        }
        return word;
      })
      .join(" ");

    const resBody: resBody = { cleanedBody };
    return resBody;      
  } catch (err) {
    next(err);
  }
}
