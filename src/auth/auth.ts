import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "node:crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const isValid = await argon2.verify(hash, password);
  return isValid;
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const jwtPayload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
  };
  const token = jwt.sign(jwtPayload, secret);
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret);
    if (
      typeof decoded === "string" ||
      !decoded.sub ||
      typeof decoded.sub !== "string"
    ) {
      throw new Error("Invalid token payload");
    }
    return decoded.sub;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export function getBearerToken(req: Request): string {
  const header = req.get("Authorization");
  if (!header) {
    throw new Error("Authorization header does not exist");
  }
  const jwt = header.split(" ")[1];

  return jwt;
}

export  function makeRefreshToken() {
  const refreshedToken = randomBytes(256).toString("hex");
  return refreshedToken;
}

export function getAPIKey(req: Request){
  const header = req.get("Authorization");
  if(!header){
    throw new Error("Authorization header does not exist")
  }
  const APIKey = header.split(" ")[1];
  return APIKey;
}