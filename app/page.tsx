// "use client";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { userSchema, fields, UserInput } from "@/lib/schema";

// export default function NewEntry() {
//   const [step, setStep] = useState<"form" | "preview">("form");
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const { register, handleSubmit, getValues, reset, formState: { errors } } =
//     useForm<UserInput>({ resolver: zodResolver(userSchema) });

//   const save = async () => {
//     setSaving(true); setError("");
//     const res = await fetch("/api/users", {
//       method: "POST", headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(getValues()),
//     });
//     setSaving(false);
//     if (!res.ok) return setError("Could not save. Check the details and try again.");
//     setMessage(`Saved the entry for ${getValues("name")}.`);
//     reset(); setStep("form");
//   };

//   const field = (key: keyof UserInput, label: string, input: React.ReactNode, full = false) => (
//     <div className={full ? "full" : ""}>
//       <label htmlFor={key}>{label}</label>
//       {input}
//       {errors[key] && <div className="err">{errors[key]?.message}</div>}
//     </div>
//   );

//   if (step === "preview") {
//     const v = getValues();
//     return (
//       <>
//         <h1>Check the details</h1>
//         <p className="sub">Confirm everything is correct before saving.</p>
//         <div className="panel">
//           <dl>{fields.map((f) => (<div key={f.key} style={{ display: "contents" }}><dt>{f.label}</dt><dd>{v[f.key] || "-"}</dd></div>))}</dl>
//           {error && <div className="err" style={{ marginTop: 16 }}>{error}</div>}
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
//       <h1>New entry</h1>
//       <p className="sub">Enter the daily activity details, then preview them before saving.</p>
//       {message && <div className="ok" role="status">{message}</div>}
//       <form className="panel" onSubmit={handleSubmit(() => { setMessage(""); setStep("preview"); })} noValidate>
//         <div className="grid">
//           {field("name", "Name", <input id="name" {...register("name")} />)}
//           {field("officialEmail", "Official mail ID", <input id="officialEmail" type="email" {...register("officialEmail")} />)}
//           {field("date", "Date", <input id="date" type="date" {...register("date")} />)}
//           {field("stepCount", "Step count", <input id="stepCount" inputMode="numeric" {...register("stepCount")} />)}
//           {field("activity", "Activity", (
//             <select id="activity" defaultValue="" {...register("activity")}>
//               <option value="" disabled>Select</option><option>Done</option><option>Not done</option>
//             </select>
//           ))}
//           {field("activityCount", "Activity count", <input id="activityCount" inputMode="numeric" {...register("activityCount")} />)}
//           {field("additionalActivity", "Additional activity (optional)", <input id="additionalActivity" {...register("additionalActivity")} />)}
//           {field("additionalCount", "Count (optional)", <input id="additionalCount" inputMode="numeric" {...register("additionalCount")} />)}
//         </div>
//         <div className="actions"><button type="submit">Preview</button></div>
//       </form>
//     </>
//   );
// }

"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, fields, UserInput } from "@/lib/schema";

export default function NewEntry() {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, handleSubmit, getValues, reset, formState: { errors } } =
    useForm<UserInput>({ resolver: zodResolver(userSchema) });

  const save = async () => {
    setSaving(true); setError("");
    const res = await fetch("/api/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getValues()),
    });
    setSaving(false);
    if (!res.ok) return setError("Could not save. Check the details and try again.");
    setMessage(`Saved the entry for ${getValues("name")}.`);
    reset(); setStep("form");
  };

  const field = (key: keyof UserInput, label: string, input: React.ReactNode, full = false) => (
    <div className={full ? "full" : ""}>
      <label htmlFor={key}>{label}</label>
      {input}
      {errors[key] && <div className="err" role="alert">{errors[key]?.message}</div>}
    </div>
  );

  if (step === "preview") {
    const v = getValues();
    return (
      <>
        <h1>Check the details</h1>
        <p className="sub">Confirm everything is correct before saving.</p>
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
      <h1>New entry</h1>
      <p className="sub">Enter the daily activity details, then preview them before saving.</p>
      {message && <div className="ok" role="status">{message}</div>}
      <form className="panel" onSubmit={handleSubmit(() => { setMessage(""); setStep("preview"); })} noValidate>
        <section className="group">
          <h2>Details</h2>
          <div className="grid">
            {field("name", "Name", <input id="name" autoComplete="name" {...register("name")} />)}
            {field("officialEmail", "Official mail ID", <input id="officialEmail" type="email" autoComplete="email" {...register("officialEmail")} />)}
            {field("date", "Date", <input id="date" type="date" {...register("date")} />)}
          </div>
        </section>
        <section className="group">
          <h2>Today's activity</h2>
          <div className="grid">
            {field("stepCount", "Step count", <input id="stepCount" inputMode="numeric" {...register("stepCount")} />)}
            {field("activity", "Activity", (
              <select id="activity" defaultValue="" {...register("activity")}>
                <option value="" disabled>Select</option><option>Done</option><option>Not done</option>
              </select>
            ))}
            {field("activityCount", "Activity count", <input id="activityCount" inputMode="numeric" {...register("activityCount")} />)}
          </div>
        </section>
        <section className="group">
          <h2>Additional activity</h2>
          <div className="grid">
            {field("additionalActivity", "Additional activity (optional)", <input id="additionalActivity" {...register("additionalActivity")} />)}
            {field("additionalCount", "Count (optional)", <input id="additionalCount" inputMode="numeric" {...register("additionalCount")} />)}
          </div>
        </section>
        <div className="actions"><button type="submit">Preview entry</button></div>
      </form>
    </>
  );
}