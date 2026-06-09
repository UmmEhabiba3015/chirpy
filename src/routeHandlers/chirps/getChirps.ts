import { NextFunction, Request, Response } from "express";
import {
  getChirpById,
  getChirps,
  getChirpsByAuthorId,
} from "../../db/queries/chirps.js";
import {
  errorHandler,
  NotFoundError,
} from "../../middleware/errorHandler.middleware.js";

export async function getChirpsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sort = req.query.sort || "asc";
  try {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
      authorId = authorIdQuery;
    }
    if (authorId !== "") {
      const chirpsForAuthor = await getChirpsByAuthorId(authorId);
      chirpsForAuthor.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sort === "desc" ? dateB - dateA : dateA - dateB;
      });
      res.status(200).json(chirpsForAuthor);
      return;
    }
  } catch (err) {
    next(err);
  }

  try {
    const chirps = await getChirps();
    chirps.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === "desc" ? dateB - dateA : dateA - dateB;
    });
    res.status(200).json(chirps);
  } catch (err) {
    next(err);
  }
}

export async function getChirpByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sort = req.query.sort || "asc";
  const chirpId = req.params.chirpId;
  try {
    const chirp = await getChirpById(chirpId as string);
    if (!chirp) {
      errorHandler(
        new NotFoundError(`Chirp with id ${chirpId} not found`),
        req,
        res,
        next,
      );
      return;
    }
    const chirps = await getChirps();

    chirps.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sort === "desc" ? dateB - dateA : dateA - dateB;
    });
    res.status(200).json(chirp);
  } catch (err) {
    next(err);
  }
}
