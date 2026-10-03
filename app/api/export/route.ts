import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { listSubmissions } from "@/lib/submissions";
import { FieldDef } from "@/lib/templates";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return new Response("Admin login required", { status: 401 });
  const id = req.nextUrl.searchParams.get("template");
  const { data: t } = await supabase.from("form_templates").select("name,slug,fields").eq("id", id ?? "").maybeSingle();
  if (!t) return new Response("Template not found", { status: 404 });

  const fields: FieldDef[] = t.fields;
  const rows = await listSubmissions(id!, req.nextUrl.searchParams.get("q") ?? "");

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(t.name.slice(0, 31).replace(/[\\/?*[\]:]/g, " "));
  ws.columns = [...fields.map((f) => ({ header: f.label, key: f.key, width: 22 })), { header: "Created date", key: "createdAt", width: 20 }];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  rows.forEach((r) => {
    const row: Record<string, any> = { createdAt: new Date(r.created_at).toLocaleString("en-IN") };
    fields.forEach((f) => { const v = r.data?.[f.key] ?? ""; row[f.key] = f.type === "number" && v !== "" ? Number(v) : v; });
    ws.addRow(row);
  });

  return new Response(await wb.xlsx.writeBuffer(), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${t.slug}-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
