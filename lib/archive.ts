// import ExcelJS from "exceljs";
// import { supabase } from "./supabase";
// import { FieldDef } from "./templates";

// const BUCKET = "backups";
// const istMonthNow = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 7);

// // Backs up one past month of a template to Excel in Storage, verifies it, then deletes those rows.
// export async function archiveMonth(templateId: string, month: string) {
//   if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Choose a valid month.");
//   if (month >= istMonthNow()) throw new Error("Only completed months can be archived.");

//   const { data: t } = await supabase.from("form_templates").select("name,slug,fields").eq("id", templateId).maybeSingle();
//   if (!t) throw new Error("Template not found.");
//   const fields: FieldDef[] = t.fields;

//   const { data: existing } = await supabase.from("monthly_backups").select("id").eq("template_id", templateId).eq("month", month).maybeSingle();
//   if (existing) throw new Error("This month is already archived.");

//   // Month boundaries in India time (+05:30)
//   const [y, m] = month.split("-").map(Number);
//   const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
//   const start = `${month}-01T00:00:00+05:30`, end = `${next}-01T00:00:00+05:30`;

//   const rows: any[] = [];
//   for (let from = 0; ; from += 1000) {
//     const { data, error } = await supabase.from("submissions").select("id,data,created_at").eq("template_id", templateId)
//       .gte("created_at", start).lt("created_at", end).order("created_at").range(from, from + 999);
//     if (error) throw new Error(error.message);
//     rows.push(...(data ?? []));
//     if ((data?.length ?? 0) < 1000) break;
//   }
//   if (rows.length === 0) throw new Error("There are no entries in that month.");

//   // 1. Build the Excel file
//   const wb = new ExcelJS.Workbook();
//   const ws = wb.addWorksheet(month);
//   ws.columns = [...fields.map((f) => ({ header: f.label, key: f.key, width: 22 })), { header: "Created date", key: "createdAt", width: 20 }];
//   ws.getRow(1).font = { bold: true };
//   rows.forEach((r) => {
//     const row: Record<string, any> = { createdAt: new Date(r.created_at).toLocaleString("en-IN") };
//     fields.forEach((f) => { const v = r.data?.[f.key] ?? ""; row[f.key] = f.type === "number" && v !== "" ? Number(v) : v; });
//     ws.addRow(row);
//   });

//   // 2. Upload it
//   const path = `${t.slug}/${month}.xlsx`;
//   const up = await supabase.storage.from(BUCKET).upload(path, Buffer.from(await wb.xlsx.writeBuffer()), {
//     upsert: true, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   if (up.error) throw new Error(`Upload failed: ${up.error.message}`);

//   // 3. Download it again and check the row count before anything is deleted
//   const dl = await supabase.storage.from(BUCKET).download(path);
//   if (dl.error || !dl.data) throw new Error("Could not verify the uploaded file. Nothing was deleted.");
//   const check = new ExcelJS.Workbook();
//   await check.xlsx.load(Buffer.from(await dl.data.arrayBuffer()) as any);
//   if (check.worksheets[0].rowCount - 1 !== rows.length) throw new Error("Backup file did not match. Nothing was deleted.");

//   // 4. Record the backup, and only then delete the exact rows that were backed up
//   const rec = await supabase.from("monthly_backups").insert({ template_id: templateId, month, row_count: rows.length, file_path: path });
//   if (rec.error) throw new Error(`Could not record the backup: ${rec.error.message}. Nothing was deleted.`);
//   const ids = rows.map((r) => r.id);
//   for (let i = 0; i < ids.length; i += 200) {
//     const del = await supabase.from("submissions").delete().in("id", ids.slice(i, i + 200));
//     if (del.error) throw new Error(`Backup saved, but deleting failed: ${del.error.message}`);
//   }
//   return { rowCount: rows.length, path };
// }

import ExcelJS from "exceljs";
import { supabase } from "./supabase";
import { FieldDef } from "./templates";

const BUCKET = "backups";
const istMonthNow = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 7);

// Backs up one past month of a template to Excel in Storage, verifies it, then deletes those rows.
export async function archiveMonth(templateId: string, month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error("Choose a valid month.");
  if (month >= istMonthNow()) throw new Error("Only completed months can be archived.");

  const { data: t } = await supabase.from("form_templates").select("name,slug,fields").eq("id", templateId).maybeSingle();
  if (!t) throw new Error("Template not found.");
  const fields: FieldDef[] = t.fields;

  const { data: existing } = await supabase.from("monthly_backups").select("id").eq("template_id", templateId).eq("month", month).maybeSingle();
  if (existing) throw new Error("This month is already archived.");

  // Month boundaries in India time (+05:30)
  const [y, m] = month.split("-").map(Number);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const start = `${month}-01T00:00:00+05:30`, end = `${next}-01T00:00:00+05:30`;

  const rows: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("submissions").select("id,data,created_at").eq("template_id", templateId)
      .gte("created_at", start).lt("created_at", end).order("created_at").range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < 1000) break;
  }
  if (rows.length === 0) throw new Error("There are no entries in that month.");

  // 1. Build the Excel file
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(`${t.name} ${month}`.slice(0, 31).replace(/[\\/?*[\]:]/g, " "));
  ws.columns = [...fields.map((f) => ({ header: f.label, key: f.key, width: 22 })), { header: "Created date", key: "createdAt", width: 20 }];
  ws.getRow(1).font = { bold: true };
  rows.forEach((r) => {
    const row: Record<string, any> = { createdAt: new Date(r.created_at).toLocaleString("en-IN") };
    fields.forEach((f) => { const v = r.data?.[f.key] ?? ""; row[f.key] = f.type === "number" && v !== "" ? Number(v) : v; });
    ws.addRow(row);
  });

  // 2. Upload it
  const path = `${t.slug}/${t.slug}-${month}.xlsx`; // e.g. daily-activity/daily-activity-2026-09.xlsx
  const up = await supabase.storage.from(BUCKET).upload(path, Buffer.from(await wb.xlsx.writeBuffer()), {
    upsert: true, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  if (up.error) throw new Error(`Upload failed: ${up.error.message}`);

  // 3. Download it again and check the row count before anything is deleted
  const dl = await supabase.storage.from(BUCKET).download(path);
  if (dl.error || !dl.data) throw new Error("Could not verify the uploaded file. Nothing was deleted.");
  const check = new ExcelJS.Workbook();
  await check.xlsx.load(Buffer.from(await dl.data.arrayBuffer()) as any);
  if (check.worksheets[0].rowCount - 1 !== rows.length) throw new Error("Backup file did not match. Nothing was deleted.");

  // 4. Record the backup, and only then delete the exact rows that were backed up
  const rec = await supabase.from("monthly_backups").insert({ template_id: templateId, month, row_count: rows.length, file_path: path });
  if (rec.error) throw new Error(`Could not record the backup: ${rec.error.message}. Nothing was deleted.`);
  const ids = rows.map((r) => r.id);
  for (let i = 0; i < ids.length; i += 200) {
    const del = await supabase.from("submissions").delete().in("id", ids.slice(i, i + 200));
    if (del.error) throw new Error(`Backup saved, but deleting failed: ${del.error.message}`);
  }
  return { rowCount: rows.length, path };
}