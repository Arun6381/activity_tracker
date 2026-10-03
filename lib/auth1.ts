import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./session";

// Returns the logged-in admin's email, or null if not logged in
export async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : null;
}
