import { getServerSession } from "next-auth";
import { authOptions } from "@/server/config/auth";

export async function getCustomServerSession() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
