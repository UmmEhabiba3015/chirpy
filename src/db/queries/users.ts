import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function resetUsers() {
  await db.delete(users).execute();
}

export async function getUserByEmail(email: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();
  return user[0];
}

export async function updateUsers(
  userID: string,
  email: string,
  password: string,
) {
  const [userUpdate] = await db
    .update(users)
    .set({
      email: email,
      hashedPassword: password,
    })
    .where(eq(users.id, userID))
    .returning();
  return userUpdate;
}

export async function updateUsersToChirpyRed(id: string) {
  const [userUpdate] = await db
    .update(users)
    .set({
      isChirpyRed: true,
    })
    .where(eq(users.id, id))
    .returning();
  return userUpdate;
}
