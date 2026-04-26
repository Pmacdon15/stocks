import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { createUser, getUser, type User } from "@/db/queries";

export async function getAuthUser(): Promise<User> {
  await connection;
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    let user = await getUser(userId);
    //TODO make this happen on the web hook
    if (!user) {
      user = await createUser(userId);
    }
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
}
