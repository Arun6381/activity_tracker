// // "use client";
// // import { useEffect, useState } from "react";
// // import { FieldDef, Template, TYPES, keyify, slugify } from "@/lib/templates";

// // type F = FieldDef & { _new?: boolean; _opts?: string };
// // type Draft = { id?: string; name: string; slug: string; is_active: boolean; fields: F[] };
// // const blank = (): Draft => ({ name: "", slug: "", is_active: true, fields: [{ key: "", label: "", type: "text", required: true, _new: true }] });

// // export default function Builder() {
// //   const [list, setList] = useState<Template[]>([]);
// //   const [d, setD] = useState<Draft | null>(null);
// //   const [error, setError] = useState("");
// //   const [busy, setBusy] = useState(false);

// //   const load = () => fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then(setList);
// //   useEffect(() => { load(); }, []);

// //   const edit = (t: Template) => { setError(""); setD({ id: t.id, name: t.name, slug: t.slug, is_active: t.is_active, fields: t.fields.map((f) => ({ ...f, _opts: f.options?.join(", ") })) }); };
// //   const setField = (i: number, patch: Partial<F>) => setD((x) => x && { ...x, fields: x.fields.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
// //   const move = (i: number, by: number) => setD((x) => {
// //     if (!x || i + by < 0 || i + by >= x.fields.length) return x;
// //     const fields = [...x.fields]; [fields[i], fields[i + by]] = [fields[i + by], fields[i]]; return { ...x, fields };
// //   });

// //   const save = async () => {
// //     if (!d) return;
// //     setBusy(true); setError("");
// //     const fields = d.fields.map(({ _new, _opts, ...f }) => ({ ...f, required: !!f.required, options: f.type === "select" ? (_opts ?? "").split(",").map((s) => s.trim()).filter(Boolean) : undefined }));
// //     const res = await fetch(d.id ? `/api/admin/templates/${d.id}` : "/api/admin/templates", {
// //       method: d.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ name: d.name, slug: d.slug, is_active: d.is_active, fields }),
// //     });
// //     setBusy(false);
// //     if (!res.ok) return setError((await res.json().catch(() => ({}))).error || "Could not save the template.");
// //     setD(null); load();
// //   };

// //   if (d) return (
// //     <>
// //       <h1>{d.id ? "Edit template" : "New template"}</h1>
// //       <p className="sub">Define the fields people will fill in.</p>
// //       <div className="panel">
// //         <div className="grid">
// //           <div><label htmlFor="tn">Template name</label>
// //             <input id="tn" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value, slug: d.id ? d.slug : slugify(e.target.value) })} /></div>
// //           <div><label htmlFor="ts">URL name (/f/...)</label>
// //             <input id="ts" value={d.slug} disabled={!!d.id} onChange={(e) => setD({ ...d, slug: slugify(e.target.value) })} /></div>
// //         </div>
// //         <label style={{ display: "flex", gap: 8, alignItems: "center", margin: "16px 0" }}>
// //           <input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={d.is_active} onChange={(e) => setD({ ...d, is_active: e.target.checked })} /> Active (people can fill it in)
// //         </label>
// //         <div className="group"><h2>Fields</h2></div>
// //         {d.fields.map((f, i) => (
// //           <div className="frow" key={i}>
// //             <div><label>Label</label>
// //               <input value={f.label} onChange={(e) => setField(i, { label: e.target.value, ...(f._new ? { key: keyify(e.target.value) } : {}) })} />
// //               <div className="small">{f.key ? `Key: ${f.key}${f._new ? "" : " (locked)"}` : "Key is created from the label"}</div></div>
// //             <div><label>Type</label>
// //               <select value={f.type} onChange={(e) => setField(i, { type: e.target.value as F["type"] })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
// //             <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={!!f.required} onChange={(e) => setField(i, { required: e.target.checked })} />Required</label>
// //             <div className="actions" style={{ margin: 0, gap: 6 }}>
// //               <button type="button" className="ghost" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
// //               <button type="button" className="ghost" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
// //               <button type="button" className="ghost" onClick={() => setD({ ...d, fields: d.fields.filter((_, j) => j !== i) })} aria-label="Remove field">✕</button>
// //             </div>
// //             {f.type === "select" && <div style={{ gridColumn: "1 / -1" }}><label>Options (separate with commas)</label>
// //               <input value={f._opts ?? ""} onChange={(e) => setField(i, { _opts: e.target.value })} placeholder="Done, Not done" /></div>}
// //           </div>
// //         ))}
// //         <div className="actions" style={{ marginTop: 16 }}>
// //           <button type="button" className="ghost" onClick={() => setD({ ...d, fields: [...d.fields, { key: "", label: "", type: "text", required: false, _new: true }] })}>+ Add field</button>
// //         </div>
// //         {error && <div className="err" role="alert" style={{ marginTop: 16 }}>{error}</div>}
// //         <div className="actions" style={{ marginTop: 24 }}>
// //           <button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save template"}</button>
// //           <button className="ghost" onClick={() => setD(null)} disabled={busy}>Cancel</button>
// //         </div>
// //       </div>
// //     </>
// //   );

// //   return (
// //     <>
// //       <h1>Templates</h1>
// //       <p className="sub">Create the forms people fill in. Each template has its own fields, records and Excel export.</p>
// //       <div className="actions" style={{ marginBottom: 16 }}><button onClick={() => { setError(""); setD(blank()); }}>+ New template</button></div>
// //       <div className="panel">
// //         {list.length === 0 ? <div className="empty">No templates yet.</div> : list.map((t) => (
// //           <div className="frow" style={{ gridTemplateColumns: "1fr auto" }} key={t.id}>
// //             <div><strong>{t.name}</strong> {!t.is_active && <span className="small">(inactive)</span>}
// //               <div className="small">/f/{t.slug} · {t.fields.length} fields</div></div>
// //             <button className="ghost" onClick={() => edit(t)}>Edit</button>
// //           </div>
// //         ))}
// //       </div>
// //     </>
// //   );
// // }

// "use client";
// import { useEffect, useState } from "react";
// import { FieldDef, Template, TYPES, keyify, slugify } from "@/lib/templates";

// type F = FieldDef & { _new?: boolean; _opts?: string };
// type Draft = { id?: string; name: string; slug: string; is_active: boolean; fields: F[] };
// const blank = (): Draft => ({ name: "", slug: "", is_active: true, fields: [{ key: "", label: "", type: "text", required: true, _new: true }] });

// export default function Builder() {
//   const [list, setList] = useState<Template[]>([]);
//   const [d, setD] = useState<Draft | null>(null);
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);

//   const load = () => fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then(setList);
//   useEffect(() => { load(); }, []);

//   const edit = (t: Template) => { setError(""); setD({ id: t.id, name: t.name, slug: t.slug, is_active: t.is_active, fields: t.fields.map((f) => ({ ...f, _opts: f.options?.join(", ") })) }); };
//   const setField = (i: number, patch: Partial<F>) => setD((x) => x && { ...x, fields: x.fields.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
//   const move = (i: number, by: number) => setD((x) => {
//     if (!x || i + by < 0 || i + by >= x.fields.length) return x;
//     const fields = [...x.fields]; [fields[i], fields[i + by]] = [fields[i + by], fields[i]]; return { ...x, fields };
//   });

//   const save = async () => {
//     if (!d) return;
//     setBusy(true); setError("");
//     const fields = d.fields.map(({ _new, _opts, ...f }) => ({ ...f, required: !!f.required, options: f.type === "select" ? (_opts ?? "").split(",").map((s) => s.trim()).filter(Boolean) : undefined }));
//     const res = await fetch(d.id ? `/api/admin/templates/${d.id}` : "/api/admin/templates", {
//       method: d.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: d.name, slug: d.slug, is_active: d.is_active, fields }),
//     });
//     setBusy(false);
//     if (!res.ok) return setError((await res.json().catch(() => ({}))).error || "Could not save the template.");
//     setD(null); load();
//   };

//   if (d) return (
//     <>
//       <h1>{d.id ? "Edit template" : "New template"}</h1>
//       <p className="sub">Define the fields people will fill in.</p>
//       <div className="panel">
//         <div className="grid">
//           <div><label htmlFor="tn">Template name</label>
//             <input id="tn" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value, slug: d.id ? d.slug : slugify(e.target.value) })} /></div>
//           <div><label htmlFor="ts">URL name (/f/...)</label>
//             <input id="ts" value={d.slug} disabled={!!d.id} onChange={(e) => setD({ ...d, slug: slugify(e.target.value) })} /></div>
//         </div>
//         <label className="chk" style={{ margin: "16px 0" }}>
//           <input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={d.is_active} onChange={(e) => setD({ ...d, is_active: e.target.checked })} /> Active (people can fill it in)
//         </label>
//         <div className="group"><h2>Fields</h2></div>
//         {d.fields.map((f, i) => (
//           <div className="frow" key={i}>
//             <div><label>Label</label>
//               <input value={f.label} onChange={(e) => setField(i, { label: e.target.value, ...(f._new ? { key: keyify(e.target.value) } : {}) })} />
//               <div className="small">{f.key ? `Key: ${f.key}${f._new ? "" : " (locked)"}` : "Key is created from the label"}</div></div>
//             <div><label>Type</label>
//               <select value={f.type} onChange={(e) => setField(i, { type: e.target.value as F["type"] })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
//             <div><label className="sp" aria-hidden="true">&nbsp;</label>
//               <label className="chk"><input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={!!f.required} onChange={(e) => setField(i, { required: e.target.checked })} />Required</label></div>
//             <div><label className="sp" aria-hidden="true">&nbsp;</label>
//             <div className="actions" style={{ margin: 0, gap: 6, flexWrap: "nowrap" }}>
//               <button type="button" className="ghost" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
//               <button type="button" className="ghost" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
//               <button type="button" className="ghost" onClick={() => setD({ ...d, fields: d.fields.filter((_, j) => j !== i) })} aria-label="Remove field">✕</button>
//             </div></div>
//             {f.type === "select" && <div style={{ gridColumn: "1 / -1" }}><label>Options (separate with commas)</label>
//               <input value={f._opts ?? ""} onChange={(e) => setField(i, { _opts: e.target.value })} placeholder="Done, Not done" /></div>}
//           </div>
//         ))}
//         <div className="actions" style={{ marginTop: 16 }}>
//           <button type="button" className="ghost" onClick={() => setD({ ...d, fields: [...d.fields, { key: "", label: "", type: "text", required: false, _new: true }] })}>+ Add field</button>
//         </div>
//         {error && <div className="err" role="alert" style={{ marginTop: 16 }}>{error}</div>}
//         <div className="actions" style={{ marginTop: 24 }}>
//           <button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save template"}</button>
//           <button className="ghost" onClick={() => setD(null)} disabled={busy}>Cancel</button>
//         </div>
//       </div>
//     </>
//   );

//   return (
//     <>
//       <h1>Templates</h1>
//       <p className="sub">Create the forms people fill in. Each template has its own fields, records and Excel export.</p>
//       <div className="actions" style={{ marginBottom: 16 }}><button onClick={() => { setError(""); setD(blank()); }}>+ New template</button></div>
//       <div className="panel">
//         {list.length === 0 ? <div className="empty">No templates yet.</div> : list.map((t) => (
//           <div className="frow" style={{ gridTemplateColumns: "1fr auto", alignItems: "center" }} key={t.id}>
//             <div><strong>{t.name}</strong> {!t.is_active && <span className="small">(inactive)</span>}
//               <div className="small">/f/{t.slug} · {t.fields.length} fields</div></div>
//             <button className="ghost" onClick={() => edit(t)}>Edit</button>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { FieldDef, Template, TYPES, keyify, slugify } from "@/lib/templates";

type F = FieldDef & { _new?: boolean; _opts?: string };
type Draft = { id?: string; name: string; slug: string; is_active: boolean; fields: F[] };
const blank = (): Draft => ({ name: "", slug: "", is_active: true, fields: [{ key: "", label: "", type: "text", required: true, _new: true }] });

export default function Builder() {
  const [list, setList] = useState<Template[]>([]);
  const [d, setD] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => fetch("/api/admin/templates").then((r) => (r.ok ? r.json() : [])).then(setList);
  useEffect(() => { load(); }, []);

  const edit = (t: Template) => { setError(""); setD({ id: t.id, name: t.name, slug: t.slug, is_active: t.is_active, fields: t.fields.map((f) => ({ ...f, _opts: f.options?.join(", ") })) }); };
  const setField = (i: number, patch: Partial<F>) => setD((x) => x && { ...x, fields: x.fields.map((f, j) => (j === i ? { ...f, ...patch } : f)) });
  const move = (i: number, by: number) => setD((x) => {
    if (!x || i + by < 0 || i + by >= x.fields.length) return x;
    const fields = [...x.fields]; [fields[i], fields[i + by]] = [fields[i + by], fields[i]]; return { ...x, fields };
  });

  const save = async () => {
    if (!d) return;
    setBusy(true); setError("");
    const fields = d.fields.map(({ _new, _opts, ...f }) => ({ ...f, required: !!f.required, options: f.type === "select" ? (_opts ?? "").split(",").map((s) => s.trim()).filter(Boolean) : undefined }));
    const res = await fetch(d.id ? `/api/admin/templates/${d.id}` : "/api/admin/templates", {
      method: d.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: d.name, slug: d.slug, is_active: d.is_active, fields }),
    });
    setBusy(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || "Could not save the template.");
    setD(null); load();
  };

  if (d) return (
    <>
      <button type="button" className="ghost" style={{ minHeight: 40, padding: "6px 14px", marginBottom: 16 }} onClick={() => setD(null)} disabled={busy}>← Back to templates</button>
      <h1>{d.id ? "Edit template" : "New template"}</h1>
      <p className="sub">Define the fields people will fill in.</p>
      <div className="panel">
        <div className="grid">
          <div><label htmlFor="tn">Template name</label>
            <input id="tn" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value, slug: d.id ? d.slug : slugify(e.target.value) })} /></div>
          <div><label htmlFor="ts">URL name (/f/...)</label>
            <input id="ts" value={d.slug} disabled={!!d.id} onChange={(e) => setD({ ...d, slug: slugify(e.target.value) })} /></div>
        </div>
        <label className="chk" style={{ margin: "16px 0" }}>
          <input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={d.is_active} onChange={(e) => setD({ ...d, is_active: e.target.checked })} /> Active (people can fill it in)
        </label>
        <div className="group"><h2>Fields</h2></div>
        {d.fields.map((f, i) => (
          <div className="frow" key={i}>
            <div><label>Label</label>
              <input value={f.label} onChange={(e) => setField(i, { label: e.target.value, ...(f._new ? { key: keyify(e.target.value) } : {}) })} />
              <div className="small">{f.key ? `Key: ${f.key}${f._new ? "" : " (locked)"}` : "Key is created from the label"}</div></div>
            <div><label>Type</label>
              <select value={f.type} onChange={(e) => setField(i, { type: e.target.value as F["type"] })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className="sp" aria-hidden="true">&nbsp;</label>
              <label className="chk"><input type="checkbox" style={{ width: 18, minHeight: 18 }} checked={!!f.required} onChange={(e) => setField(i, { required: e.target.checked })} />Required</label></div>
            <div><label className="sp" aria-hidden="true">&nbsp;</label>
            <div className="actions" style={{ margin: 0, gap: 6, flexWrap: "nowrap" }}>
              <button type="button" className="ghost" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className="ghost" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className="ghost" onClick={() => setD({ ...d, fields: d.fields.filter((_, j) => j !== i) })} aria-label="Remove field">✕</button>
            </div></div>
            {f.type === "select" && <div style={{ gridColumn: "1 / -1" }}><label>Options (separate with commas)</label>
              <input value={f._opts ?? ""} onChange={(e) => setField(i, { _opts: e.target.value })} placeholder="Done, Not done" /></div>}
          </div>
        ))}
        <div className="actions" style={{ marginTop: 16 }}>
          <button type="button" className="ghost" onClick={() => setD({ ...d, fields: [...d.fields, { key: "", label: "", type: "text", required: false, _new: true }] })}>+ Add field</button>
        </div>
        {error && <div className="err" role="alert" style={{ marginTop: 16 }}>{error}</div>}
        <div className="actions" style={{ marginTop: 24 }}>
          <button onClick={save} disabled={busy}>{busy ? "Saving..." : "Save template"}</button>
          <button className="ghost" onClick={() => setD(null)} disabled={busy}>Cancel</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <h1>Templates</h1>
      <p className="sub">Create the forms people fill in. Each template has its own fields, records and Excel export.</p>
      <div className="actions" style={{ marginBottom: 16 }}><button onClick={() => { setError(""); setD(blank()); }}>+ New template</button></div>
      <div className="panel">
        {list.length === 0 ? <div className="empty">No templates yet.</div> : list.map((t) => (
          <div className="frow" style={{ gridTemplateColumns: "1fr auto", alignItems: "center" }} key={t.id}>
            <div><strong>{t.name}</strong> {!t.is_active && <span className="small">(inactive)</span>}
              <div className="small">/f/{t.slug} · {t.fields.length} fields</div></div>
            <button className="ghost" onClick={() => edit(t)}>Edit</button>
          </div>
        ))}
      </div>
    </>
  );
}