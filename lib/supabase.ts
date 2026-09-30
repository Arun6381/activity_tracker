import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");

// Server-only client. The secret key bypasses Row Level Security, so never import this in client components.
export const supabase = createClient(url, key, { auth: { persistSession: false } });
