import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT,hashPassword,verifyPassword } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await verifyPassword(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Password Hashing", () => {
  const userID= "user@123";
  const expiresIn = 30;
  const secret= "Mysecret"
  let jwtToken: string;
  let validate: string;

  beforeAll(async () => {
    jwtToken = makeJWT(userID,expiresIn,secret);
  });

  it("should return true for the correct password", async () => {
    const result = validateJWT(jwtToken,secret);;
    expect(result).toBe(userID);
  });
});