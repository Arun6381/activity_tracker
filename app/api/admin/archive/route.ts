import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { archiveMonth } from "@/lib/archive";

const denied = () => NextResponse.json({ error: "Admin login required" }, { status: 401 });

// GET -> list of backups (optionally ?template=<id>)   |   GET ?id=<backup id> -> download (add &format=json for a link)   |   GET ?id=<backup id> -> download the file
export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return denied();
  const p = req.nextUrl.searchParams;
  if (p.get("id")) {
    const { data: b } = await supabase.from("monthly_backups").select("file_path, month, form_templates(slug)").eq("id", p.get("id")!).maybeSingle();
    if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Downloaded file is named <template>-<month>.xlsx, e.g. daily-activity-2026-09.xlsx
    const slug = (b as any).form_templates?.slug ?? "backup";
    const filename = `${slug}-${b.month}.xlsx`;
    const { data } = await supabase.storage.from("backups").createSignedUrl(b.file_path, 60, { download: filename });
    if (!data) return NextResponse.json({ error: "File missing" }, { status: 404 });
    // The mobile app asks for ?format=json and downloads the link itself; the website just follows the redirect
    return p.get("format") === "json" ? NextResponse.json({ url: data.signedUrl, filename }) : NextResponse.redirect(data.signedUrl);
  }
  // All archived months (newest first), with the template name; ?template=<id> filters to one template
  let query = supabase.from("monthly_backups").select("*, form_templates(name)").order("created_at", { ascending: false });
  if (p.get("template")) query = query.eq("template_id", p.get("template")!);
  const { data, error } = await query;
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) return denied();
  const { template, month } = await req.json().catch(() => ({}));
  try {
    return NextResponse.json(await archiveMonth(template, month));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
