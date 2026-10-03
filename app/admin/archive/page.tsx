// "use client";
// import { useEffect, useState } from "react";
// import { Template } from "@/lib/templates";

// const lastMonth = () => { const d = new Date(Date.now() + 5.5 * 3600e3); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); };

// export default function Archive() {
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [tid, setTid] = useState("");
//   const [month, setMonth] = useState(lastMonth());
//   const [backups, setBackups] = useState<any[]>([]);
//   const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
//   const [busy, setBusy] = useState(false);

//   const loadBackups = (id = tid) => id && fetch(`/api/admin/archive?template=${id}`).then((r) => (r.ok ? r.json() : [])).then(setBackups);
//   useEffect(() => { fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then((d: Template[]) => { setTemplates(d); if (d[0]) setTid(d[0].id); }); }, []);
//   useEffect(() => { loadBackups(); }, [tid]);

//   const run = async () => {
//     const name = templates.find((t) => t.id === tid)?.name;
//     if (!confirm(`Back up ${month} for "${name}" to Excel, then DELETE those entries from the database?`)) return;
//     setBusy(true); setMsg(null);
//     const res = await fetch("/api/admin/archive", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: tid, month }) });
//     const body = await res.json().catch(() => ({}));
//     setBusy(false);
//     setMsg(res.ok ? { ok: true, text: `Archived ${body.rowCount} entries for ${month} and removed them from the database.` } : { ok: false, text: body.error || "Archive failed." });
//     loadBackups();
//   };

//   return (
//     <div className="wide">
//       <h1>Monthly archive</h1>
//       <p className="sub">Back up a finished month to Excel, then remove those entries to free database space. Archived entries can be downloaded but no longer appear in Records.</p>
//       <div className="panel" style={{ marginBottom: 20 }}>
//         <div className="toolbar" style={{ marginBottom: 0 }}>
//           <select value={tid} onChange={(e) => setTid(e.target.value)} aria-label="Form" style={{ flex: "0 1 260px" }}>
//             {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
//           </select>
//           <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" style={{ flex: "0 1 200px" }} />
//           <button onClick={run} disabled={busy || !tid}>{busy ? "Archiving..." : "Archive month"}</button>
//         </div>
//         {msg && <div className={msg.ok ? "ok" : "err"} role="status" style={{ marginTop: 16, marginBottom: 0 }}>{msg.text}</div>}
//       </div>
//       <div className="panel big">
//         {backups.length === 0 ? <div className="empty">No archived months yet.</div> : (
//           <table>
//             <thead><tr><th>Month</th><th>Entries</th><th>Archived on</th><th>File</th></tr></thead>
//             <tbody>{backups.map((b) => (
//               <tr key={b.id}>
//                 <td data-label="Month">{b.month}</td><td data-label="Entries">{b.row_count}</td>
//                 <td data-label="Archived on">{new Date(b.created_at).toLocaleString("en-IN")}</td>
//                 <td data-label="File"><a href={`/api/admin/archive?id=${b.id}`}>Download Excel</a></td>
//               </tr>
//             ))}</tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { Template } from "@/lib/templates";

const lastMonth = () => { const d = new Date(Date.now() + 5.5 * 3600e3); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0, 7); };

export default function Archive() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tid, setTid] = useState("");
  const [month, setMonth] = useState(lastMonth());
  const [backups, setBackups] = useState<any[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const loadBackups = () => fetch("/api/admin/archive").then((r) => (r.ok ? r.json() : [])).then(setBackups);
  useEffect(() => { fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then((d: Template[]) => { setTemplates(d); if (d[0]) setTid(d[0].id); }); }, []);
  useEffect(() => { loadBackups(); }, []);

  const run = async () => {
    const name = templates.find((t) => t.id === tid)?.name;
    if (!confirm(`Back up ${month} for "${name}" to Excel, then DELETE those entries from the database?`)) return;
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/archive", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: tid, month }) });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: `Archived ${body.rowCount} entries for ${month} and removed them from the database.` } : { ok: false, text: body.error || "Archive failed." });
    loadBackups();
  };

  return (
    <div className="wide">
      <h1>Monthly archive</h1>
      <p className="sub">Back up a finished month to Excel, then remove those entries to free database space. Archived entries can be downloaded but no longer appear in Records.</p>
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <select value={tid} onChange={(e) => setTid(e.target.value)} aria-label="Form" style={{ flex: "0 1 260px" }}>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" style={{ flex: "0 1 200px" }} />
          <button onClick={run} disabled={busy || !tid}>{busy ? "Archiving..." : "Archive month"}</button>
        </div>
        {msg && <div className={msg.ok ? "ok" : "err"} role="status" style={{ marginTop: 16, marginBottom: 0 }}>{msg.text}</div>}
      </div>
      <div className="panel big">
        {backups.length === 0 ? <div className="empty">No archived months yet.</div> : (
          <table>
            <thead><tr><th>Template</th><th>Month</th><th>Entries</th><th>Archived on</th><th>File</th></tr></thead>
            <tbody>{backups.map((b) => (
              <tr key={b.id}>
                <td data-label="Template">{b.form_templates?.name ?? "-"}</td><td data-label="Month">{b.month}</td><td data-label="Entries">{b.row_count}</td>
                <td data-label="Archived on">{new Date(b.created_at).toLocaleString("en-IN")}</td>
                <td data-label="File"><a href={`/api/admin/archive?id=${b.id}`}>Download Excel</a></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}