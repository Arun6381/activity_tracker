import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { userSchema, toRow, fromRow, searchFilter } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const parsed = userSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { data, error } = await supabase.from("activity_entries").insert(toRow(parsed.data)).select().single();
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(fromRow(data), { status: 201 });
}

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const filter = searchFilter(req.nextUrl.searchParams.get("q") ?? "");
  let query = supabase.from("activity_entries").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter) query = query.or(filter);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json((data ?? []).map(fromRow));
}
