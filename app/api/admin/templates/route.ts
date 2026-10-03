import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { templateDef } from "@/lib/templates";

const denied = () => NextResponse.json({ error: "Admin login required" }, { status: 401 });

export async function GET() {
  if (!(await getAdmin())) return denied();
  const { data, error } = await supabase.from("form_templates").select("*").order("created_at", { ascending: false });
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return denied();
  const p = templateDef.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0].message }, { status: 400 });
  const { data, error } = await supabase.from("form_templates").insert(p.data).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That URL name is already used" : error.message }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json(data, { status: 201 });
}
