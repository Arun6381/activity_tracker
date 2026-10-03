// import "./globals.css";
// import Link from "next/link";
// import { Manrope } from "next/font/google";
// import { getAdmin } from "@/lib/auth";
// import SignOut from "@/components/SignOut";

// const font = Manrope({ subsets: ["latin"], display: "swap" });

// export const metadata = { title: "Activity Tracker", description: "Collect, preview and export Activity Tracker" };

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const admin = await getAdmin();
//   return (
//     <html lang="en">
//       <body className={font.className}>
//         <header className="top">
//           <div className="bar">
//             <Link href="/" className="brand"><span className="mark" aria-hidden="true" />Activity Tracker</Link>
//             <Link href="/" className="nl">Forms</Link>
//             {admin ? (<><Link href="/records" className="nl">Records</Link><Link href="/admin/templates" className="nl">Templates</Link><SignOut /></>) : <Link href="/login" className="nl">Admin sign in</Link>}
//           </div>
//         </header>
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { getAdmin } from "@/lib/auth";
import SignOut from "@/components/SignOut";

const font = Manrope({ subsets: ["latin"], display: "swap" });

export const metadata = { title: "Activity Tracker", description: "Collect, preview and export Activity Tracker" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  return (
    <html lang="en">
      <body className={font.className}>
        <header className="top">
          <div className="bar">
            <Link href="/" className="brand"><span className="mark" aria-hidden="true" />Activity Tracker</Link>
            {/* <Link href="/" className="nl">Forms</Link> */}
            {admin ? (<><Link href="/records" className="nl">Records</Link><Link href="/admin/templates" className="nl">Templates</Link><Link href="/admin/archive" className="nl">Archive</Link><SignOut /></>) : <Link href="/login" className="nl">Admin</Link>}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}