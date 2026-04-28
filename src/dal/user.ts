import { auth } from "@clerk/nextjs/server";
import { connection } from "next/server";
import { getUser, type User } from "@/db/queries";

export async function getAuthUser(): Promise<User> {
  await connection;
  const { userId } = await auth.protect();
   try {
    const user = await getUser(userId);
   
    return user as User;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data");
  }
}
