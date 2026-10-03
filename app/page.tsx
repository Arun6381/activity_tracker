import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data } = await supabase.from("form_templates").select("name,slug,fields").eq("is_active", true).order("name");
  return (
    <>
      <h1>Choose a form</h1>
      <p className="sub">Pick the form you need to fill in.</p>
      {!data?.length ? <div className="panel empty">No forms are available yet.</div> : (
        <div className="cards">
          {data.map((t) => (
            <Link key={t.slug} href={`/f/${t.slug}`} className="card">
              <strong>{t.name}</strong>
              <span>{t.fields.length} fields</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
