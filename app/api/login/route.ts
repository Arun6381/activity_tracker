import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs"; // TEMP: hashing disabled, re-enable before going live
import { supabase } from "@/lib/supabase";
import { SESSION_COOKIE, SESSION_SECONDS, signSession } from "@/lib/session";

// A valid-looking hash so a wrong email takes as long to reject as a wrong password
const DUMMY_HASH = "$2a$10$CwTycUXWue0Thq9StjUM0uJ8.1oXQ5ZbYqQ0v5c0V4v3E9pTQ1w1S";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const cleanEmail = email.trim().toLowerCase();
  const { data: admin } = await supabase.from("admins").select("email, password_hash").eq("email", cleanEmail).maybeSingle();
  // TEMP (development only): plain-text comparison. The password_hash column holds the password as typed.
  const ok = !!admin && password === admin.password_hash;
  // Re-enable hashing later (and store bcrypt hashes in the column) by using this instead:
  // const ok = await bcrypt.compare(password, admin?.password_hash ?? DUMMY_HASH);

  if (!admin || !ok) return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await signSession(admin.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
