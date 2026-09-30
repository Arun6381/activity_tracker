// // "use client";
// // import { useEffect, useState } from "react";
// // import { fields } from "@/lib/schema";

// // export default function Records() {
// //   const [q, setQ] = useState("");
// //   const [rows, setRows] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     setLoading(true);
// //     const t = setTimeout(async () => {
// //       const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
// //       setRows(res.ok ? await res.json() : []);
// //       setLoading(false);
// //     }, 250); // debounce typing
// //     return () => clearTimeout(t);
// //   }, [q]);

// //   return (
// //     <>
// //       <h1>Records</h1>
// //       <p className="sub">Search saved entries and download them as an Excel file.</p>
// //       <div className="toolbar">
// //         <input placeholder="Search by name, mail ID or additional activity" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search records" />
// //         <a className="btn" href={`/api/export?q=${encodeURIComponent(q)}`}>Export to Excel</a>
// //       </div>
// //       <div className="panel scroll">
// //         {loading ? "Loading..." : rows.length === 0 ? "No records yet. Add one from New entry." : (
// //           <table>
// //             <thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th>Created date</th></tr></thead>
// //             <tbody>{rows.map((r) => <tr key={r.id}>{fields.map((f) => <td key={f.key}>{r[f.key] ?? ""}</td>)}<td>{new Date(r.createdAt).toLocaleString("en-IN")}</td></tr>)}</tbody>
// //           </table>
// //         )}
// //       </div>
// //     </>
// //   );
// // }

// "use client";
// import { useEffect, useState } from "react";
// import { fields } from "@/lib/schema";

// export default function Records() {
//   const [q, setQ] = useState("");
//   const [rows, setRows] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     const t = setTimeout(async () => {
//       const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
//       setRows(res.ok ? await res.json() : []);
//       setLoading(false);
//     }, 250); // debounce typing
//     return () => clearTimeout(t);
//   }, [q]);

//   return (
//     <div className="wide">
//       <h1>Records</h1>
//       <p className="sub">
//         Total Count of {rows.length === 1 ? "entry" : "entries"}&nbsp;
//         <strong>
//           {loading ? "Loading..." : `${rows.length}`}.
//         </strong> Search saved entries and download them as an Excel file.
//       </p>
//       <div className="toolbar">
//         <input placeholder="Search by name, mail ID or additional activity" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search records" />
//         <a className="btn" href={`/api/export?q=${encodeURIComponent(q)}`}>Export to Excel</a>
//       </div>
//       <div className="panel scroll big">
//         {loading ? "Loading..." : rows.length === 0 ? "No records yet. Add one from New entry." : (
//           <table>
//             <thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th>Created date</th></tr></thead>
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r.id}>
//                   {fields.map((f) => <td key={f.key}>{r[f.key] ?? ""}</td>)}
//                   <td>{new Date(r.createdAt).toLocaleString("en-IN")}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { fields } from "@/lib/schema";

export default function Records() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/users?q=${encodeURIComponent(q)}`);
      setRows(res.ok ? await res.json() : []);
      setLoading(false);
    }, 250); // debounce typing
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="wide">
      <h1>Records</h1>
      <p className="sub">
        {loading ? "Loading..." : `${rows.length} ${rows.length === 1 ? "entry" : "entries"}`}. Search saved entries and download them as an Excel file.
      </p>
      <div className="toolbar">
        <input placeholder="Search by name, mail ID or additional activity" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search records" />
        <a className="btn" href={`/api/export?q=${encodeURIComponent(q)}`}>Export to Excel</a>
      </div>
      <div className="panel big">
        {loading ? <div className="empty">Loading...</div> : rows.length === 0 ? <div className="empty">No records found. Add one from New entry.</div> : (
          <table>
            <thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th>Created date</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {fields.map((f) => <td key={f.key} data-label={f.label}>{r[f.key] ?? ""}</td>)}
                  <td data-label="Created date">{new Date(r.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}