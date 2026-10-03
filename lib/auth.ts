import { cookies, headers } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./session";

// Returns the logged-in admin's email, or null if not logged in.
// The website sends a login cookie; the mobile app sends "Authorization: Bearer <token>".
export async function getAdmin() {
  const auth = (await headers()).get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySession(token) : null;
}
