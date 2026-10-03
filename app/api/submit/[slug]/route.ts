import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { buildSchema } from "@/lib/templates";

// Public: anyone can submit an active template
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: t } = await supabase.from("form_templates").select("id,fields").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!t) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  const parsed = buildSchema(t.fields).safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  const { error } = await supabase.from("submissions").insert({ template_id: t.id, data: parsed.data });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
