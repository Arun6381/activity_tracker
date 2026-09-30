import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";

// Only admins can see anything under /records
export default async function RecordsLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdmin())) redirect("/login");
  return <>{children}</>;
}
