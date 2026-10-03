import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/submissions";

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const template = req.nextUrl.searchParams.get("template");
  if (!template) return NextResponse.json({ error: "template is required" }, { status: 400 });
  return NextResponse.json(await listSubmissions(template, req.nextUrl.searchParams.get("q") ?? ""));
}
