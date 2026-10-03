"use client";
import { useEffect, useState } from "react";
import { Template } from "@/lib/templates";

export default function Records() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tid, setTid] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = templates.find((x) => x.id === tid);

  useEffect(() => {
    fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then((d: Template[]) => { setTemplates(d); if (d[0]) setTid(d[0].id); else setLoading(false); });
  }, []);

  useEffect(() => {
    if (!tid) return;
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/admin/submissions?template=${tid}&q=${encodeURIComponent(q)}`);
      setRows(res.ok ? await res.json() : []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [tid, q]);

  return (
    <div className="wide">
      <h1>Records</h1>
      <p className="sub">{loading ? "Loading..." : `${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}. Pick a form, search its entries and download them as Excel.</p>
      <div className="toolbar">
        <select value={tid} onChange={(e) => setTid(e.target.value)} aria-label="Form" style={{ flex: "0 1 260px" }}>
          {templates.map((x) => <option key={x.id} value={x.id}>{x.name}{x.is_active ? "" : " (inactive)"}</option>)}
        </select>
        <input placeholder="Search entries" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search records" />
        <a className="btn" href={`/api/export?template=${tid}&q=${encodeURIComponent(q)}`}>Export to Excel</a>
      </div>
      <div className="panel big">
        {loading ? <div className="empty">Loading...</div> : !t || rows.length === 0 ? <div className="empty">No entries found.</div> : (
          <table>
            <thead><tr>{t.fields.map((f) => <th key={f.key}>{f.label}</th>)}<th>Created date</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {t.fields.map((f) => <td key={f.key} data-label={f.label}>{r.data?.[f.key] ?? ""}</td>)}
                  <td data-label="Created date">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
