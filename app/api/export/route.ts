import { NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { supabase } from "@/lib/supabase";
import { getAdmin } from "@/lib/auth";
import { fields, fromRow, searchFilter } from "@/lib/schema";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await getAdmin())) return new Response("Admin login required", { status: 401 });
  const filter = searchFilter(req.nextUrl.searchParams.get("q") ?? "");

  // Supabase returns at most 1000 rows per request, so read in pages
  const rows: any[] = [];
  for (let from = 0; ; from += 1000) {
    let query = supabase.from("activity_entries").select("*").order("created_at", { ascending: false }).range(from, from + 999);
    if (filter) query = query.or(filter);
    const { data, error } = await query;
    if (error) return new Response(error.message, { status: 500 });
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Activity report");
  ws.columns = [
    ...fields.map((f) => ({ header: f.label, key: f.key, width: 22 })),
    { header: "Created date", key: "createdAt", width: 20 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  rows.map(fromRow).forEach((u) =>
    ws.addRow({ ...u, additionalCount: u.additionalCount ?? "", createdAt: new Date(u.createdAt).toLocaleString("en-IN") })
  );

  const buffer = await wb.xlsx.writeBuffer();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="activity-report-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
