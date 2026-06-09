import { from } from "node:stream/iter";
import { db } from "../index.js";
import { NewRefreshToken, refresh_tokens, users } from "../schema.js";
import { eq } from "drizzle-orm";
import {
  errorHandler,
  UnauthorizedError,
} from "../../middleware/errorHandler.middleware.js";
import { Request, Response, NextFunction } from "express";

export async function createRefreshToken({
  token,
  userId,
  expiresAt,
}: {
  token: string;
  userId: string;
  expiresAt: Date;
}) {
  const [createdRefreshToken] = await db
    .insert(refresh_tokens)
    .values({
      token,
      userId,
      expiresAt,
      revokedAt: null,
    })
    .returning();

  return createdRefreshToken;
}
export async function getToken(refreshToken: string) {
  const [tokenRecord] = await db
    .select()
    .from(refresh_tokens)
    .where(eq(refresh_tokens.token, refreshToken));
  return tokenRecord;
}
export async function getUserFromRefreshToken(
  resfreshToken: string,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenRecord = await getToken(resfreshToken);

  if (!tokenRecord || tokenRecord.revokedAt != null) {
    errorHandler(
      new UnauthorizedError("Refresh token not found in database"),
      req,
      res,
      next,
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, tokenRecord.userId));
  return user ?? null;
}

export async function revokeToken(refreshToken: string) {
  const [revokedToken] = await db
    .update(refresh_tokens)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(refresh_tokens.token, refreshToken))
    .returning();
  return revokedToken?? null;
}
