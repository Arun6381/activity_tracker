import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdmin())) redirect("/login");
  return <>{children}</>;
}
