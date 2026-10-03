import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: the list of active forms (used by the mobile app's home screen)
export async function GET() {
  const { data, error } = await supabase.from("form_templates").select("name,slug,fields").eq("is_active", true).order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map((t) => ({ name: t.name, slug: t.slug, fieldCount: t.fields.length })));
}
