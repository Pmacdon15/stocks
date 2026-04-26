import { auth } from "@clerk/nextjs/server";
import { createUser, getUser, type User } from "@/db/queries";

export async function getAuthUser(): Promise<User> {
  const { userId } = await auth();
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
