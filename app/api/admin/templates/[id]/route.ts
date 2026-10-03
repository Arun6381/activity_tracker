import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { templateDef } from "@/lib/templates";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const { id } = await params;
  const p = templateDef.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0].message }, { status: 400 });
  const { slug, ...rest } = p.data; // the URL name never changes after creation
  const { data, error } = await supabase.from("form_templates").update(rest).eq("id", id).select().single();
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data);
}
