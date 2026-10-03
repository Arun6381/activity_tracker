// "use client";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { buildSchema, FieldDef } from "@/lib/templates";

// export default function TemplateForm({ template }: { template: { name: string; slug: string; fields: FieldDef[] } }) {
//   const { fields } = template;
//   const [step, setStep] = useState<"form" | "preview">("form");
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const { register, handleSubmit, getValues, reset, formState: { errors } } =
//     useForm<Record<string, string>>({ resolver: zodResolver(buildSchema(fields)) as any });

//   const save = async () => {
//     setSaving(true); setError("");
//     const res = await fetch(`/api/submit/${template.slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getValues()) });
//     setSaving(false);
//     if (!res.ok) return setError("Could not save. Check the details and try again.");
//     setMessage("Your entry was saved."); reset(); setStep("form");
//   };

//   const control = (f: FieldDef) =>
//     f.type === "textarea" ? <textarea id={f.key} rows={3} {...register(f.key)} /> :
//     f.type === "select" ? (
//       <select id={f.key} defaultValue="" {...register(f.key)}>
//         <option value="" disabled>Select</option>{f.options?.map((o) => <option key={o}>{o}</option>)}
//       </select>
//     ) : (
//       <input id={f.key} type={f.type === "date" ? "date" : f.type === "email" ? "email" : f.type === "phone" ? "tel" : "text"}
//         inputMode={f.type === "number" ? "decimal" : undefined} {...register(f.key)} />
//     );

//   if (step === "preview") {
//     const v = getValues();
//     return (
//       <>
//         <h1>Check the details</h1>
//         <p className="sub">{template.name}: confirm everything is correct before saving.</p>
//         <div className="panel">
//           <dl>{fields.map((f) => (<div key={f.key} style={{ display: "contents" }}><dt>{f.label}</dt><dd>{v[f.key] || "-"}</dd></div>))}</dl>
//           {error && <div className="err" role="alert" style={{ marginBottom: 16 }}>{error}</div>}
//           <div className="actions">
//             <button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save entry"}</button>
//             <button className="ghost" onClick={() => setStep("form")} disabled={saving}>Edit details</button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <h1>{template.name}</h1>
//       <p className="sub">Fill in the details, then preview them before saving.</p>
//       {message && <div className="ok" role="status">{message}</div>}
//       <form className="panel" onSubmit={handleSubmit(() => { setMessage(""); setStep("preview"); })} noValidate>
//         <div className="grid">
//           {fields.map((f) => (
//             <div key={f.key} className={f.type === "textarea" ? "full" : ""}>
//               <label htmlFor={f.key}>{f.label}{f.required ? "" : " (optional)"}</label>
//               {control(f)}
//               {errors[f.key] && <div className="err" role="alert">{String(errors[f.key]?.message)}</div>}
//             </div>
//           ))}
//         </div>
//         <div className="actions" style={{ marginTop: 24 }}><button type="submit">Preview entry</button></div>
//       </form>
//     </>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchema, FieldDef } from "@/lib/templates";

export default function TemplateForm({ template }: { template: { name: string; slug: string; fields: FieldDef[] } }) {
  const { fields } = template;
  const [step, setStep] = useState<"form" | "preview">("form");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, getValues, reset, formState: { errors } } =
    useForm<Record<string, string>>({ resolver: zodResolver(buildSchema(fields)) as any });

  const save = async () => {
    setSaving(true); setError("");
    const res = await fetch(`/api/submit/${template.slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(getValues()) });
    setSaving(false);
    if (!res.ok) return setError("Could not save. Check the details and try again.");
    setMessage("Your entry was saved."); reset(); setStep("form");
  };

  const control = (f: FieldDef) =>
    f.type === "textarea" ? <textarea id={f.key} rows={3} {...register(f.key)} /> :
    f.type === "select" ? (
      <select id={f.key} defaultValue="" {...register(f.key)}>
        <option value="" disabled>Select</option>{f.options?.map((o) => <option key={o}>{o}</option>)}
      </select>
    ) : (
      <input id={f.key} type={f.type === "date" ? "date" : f.type === "email" ? "email" : f.type === "phone" ? "tel" : "text"}
        inputMode={f.type === "number" ? "decimal" : undefined} {...register(f.key)} />
    );

  if (step === "preview") {
    const v = getValues();
    return (
      <>
        <button type="button" className="ghost" style={{ minHeight: 40, padding: "6px 14px", marginBottom: 16 }} onClick={() => setStep("form")} disabled={saving}>← Back to form</button>
        <h1>Check the details</h1>
        <p className="sub">{template.name}: confirm everything is correct before saving.</p>
        <div className="panel">
          <dl>{fields.map((f) => (<div key={f.key} style={{ display: "contents" }}><dt>{f.label}</dt><dd>{v[f.key] || "-"}</dd></div>))}</dl>
          {error && <div className="err" role="alert" style={{ marginBottom: 16 }}>{error}</div>}
          <div className="actions">
            <button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save entry"}</button>
            <button className="ghost" onClick={() => setStep("form")} disabled={saving}>Edit details</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Link href="/" className="btn ghost" style={{ minHeight: 40, padding: "6px 14px", marginBottom: 16 }}>← Back to forms</Link>
      <h1>{template.name}</h1>
      <p className="sub">Fill in the details, then preview them before saving.</p>
      {message && <div className="ok" role="status">{message}</div>}
      <form className="panel" onSubmit={handleSubmit(() => { setMessage(""); setStep("preview"); })} noValidate>
        <div className="grid">
          {fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "full" : ""}>
              <label htmlFor={f.key}>{f.label}{f.required ? "" : " (optional)"}</label>
              {control(f)}
              {errors[f.key] && <div className="err" role="alert">{String(errors[f.key]?.message)}</div>}
            </div>
          ))}
        </div>
        <div className="actions" style={{ marginTop: 24 }}><button type="submit">Preview entry</button></div>
      </form>
    </>
  );
}