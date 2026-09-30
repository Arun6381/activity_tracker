"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { setBusy(false); return setError(res.status === 401 ? "Wrong email or password." : "Could not sign in. Try again."); }
    window.location.href = "/records"; // full reload so the server sees the login cookie
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Admin sign in</h1>
      <p className="sub">Only approved admin accounts can view records.</p>
      <form className="panel" onSubmit={submit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div style={{ height: 16 }} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="err" role="alert" style={{ marginTop: 12 }}>{error}</div>}
        <div className="actions"><button type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button></div>
      </form>
    </div>
  );
}
