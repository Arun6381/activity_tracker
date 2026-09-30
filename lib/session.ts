import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7; // stay logged in for 7 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set in .env.local (at least 32 characters)");
  return new TextEncoder().encode(s);
}

export const signSession = (email: string) =>
  new SignJWT({ email }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_SECONDS}s`).sign(secret());

export async function verifySession(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
