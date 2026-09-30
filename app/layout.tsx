import "./globals.css";
import Link from "next/link";
import { getAdmin } from "@/lib/auth";
import SignOut from "@/components/SignOut";

export const metadata = { title: "Activity Tracker", description: "Collect, preview and export Activity Tracker" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return (
    <html lang="en">
      <body>
        <nav>
          <strong>Activity Tracker</strong>
          <Link href="/">New entry</Link>
          {admin ? (<><Link href="/records">Records</Link><SignOut /></>) : <Link href="/login">Admin sign in</Link>}
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
