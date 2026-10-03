import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: one active form with its field definitions
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("form_templates").select("name,slug,fields").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!data) return NextResponse.json({ error: "Form not found" }, { status: 404 });
  return NextResponse.json(data);
}
