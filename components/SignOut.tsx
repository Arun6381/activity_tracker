"use client";

export default function SignOut() {
  return (
    <button className="link" onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }}>
      Sign out
    </button>
  );
}
