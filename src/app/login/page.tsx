"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.replace("/config");
    } else {
      setError("Username atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
      <form
        onSubmit={handleLogin}
        className="bg-[#f6eede] rounded-xl shadow-lg p-8 flex flex-col gap-5 w-full max-w-sm border border-amber-200"
      >
        <h1 className="text-2xl font-bold text-amber-900 mb-2 text-center">
          Login
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="border border-amber-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-amber-900 placeholder-amber-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-amber-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white text-amber-900 placeholder-amber-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="bg-amber-300 hover:bg-amber-400 text-amber-900 p-2 rounded font-semibold transition-all border border-amber-400 hover:border-amber-500"
          type="submit"
        >
          Login
        </button>
        {error && <span className="text-red-500 text-center">{error}</span>}
      </form>
    </div>
  );
}