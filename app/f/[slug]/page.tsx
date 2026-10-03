import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TemplateForm from "@/components/TemplateForm";

export const dynamic = "force-dynamic";

export default async function FormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase.from("form_templates").select("name,slug,fields").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!data) notFound();
  return <TemplateForm template={data} />;
}
