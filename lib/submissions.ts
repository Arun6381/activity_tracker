import { supabase } from "./supabase";

// Reads a template's submissions (newest first). Search runs in the app across all answers.
export async function listSubmissions(templateId: string, q = "") {
  const rows: any[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await supabase.from("submissions").select("id,data,created_at")
      .eq("template_id", templateId).order("created_at", { ascending: false }).range(from, from + 999);
    if (error) throw error;
    rows.push(...(data ?? []));
    if ((data?.length ?? 0) < 1000) break;
  }
  const t = q.trim().toLowerCase();
  return t ? rows.filter((r) => JSON.stringify(Object.values(r.data)).toLowerCase().includes(t)) : rows;
}
