"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BLOCK_KEY = "f5d672c9e67f5ff4accad98328b45ae4d1381341eac911b695cfbbdedc40bde4";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [blockTime, setBlockTime] = useState(0);
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const blockUntil = Number(localStorage.getItem(BLOCK_KEY) || "0");
    const now = Math.floor(Date.now() / 1000);
    if (blockUntil > now) {
      setBlockTime(blockUntil - now);
    }
  }, []);

  useEffect(() => {
    if (blockTime > 0) {
      setTimer(blockTime);
      localStorage.setItem(BLOCK_KEY, String(Math.floor(Date.now() / 1000) + blockTime));
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setBlockTime(0);
            localStorage.removeItem(BLOCK_KEY);
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem(BLOCK_KEY);
    }
  }, [blockTime]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          router.replace("/config");
        }
      });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (blockTime > 0) return;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      router.replace("/config");
    } else {
      setError(data.error || "Username atau password salah.");
      if (res.status === 429 && data.error) {
        const match = data.error.match(/dalam (\d+) detik/);
        if (match) {
          setBlockTime(Number(match[1]));
        }
      }
    }
  };

  const isBlocked = blockTime > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6eede]">
      <form
        onSubmit={handleLogin}
        className="bg-[#f6eede] rounded-xl shadow-lg p-8 flex flex-col gap-5 w-full max-w-sm border border-black/10"
      >
        <h1 className="text-2xl font-bold text-black mb-2 text-center">
          Login
        </h1>
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black placeholder-gray-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={isBlocked}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-black placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isBlocked}
        />
        <button
          className="bg-gray-200 hover:bg-gray-300 text-black p-2 rounded font-semibold transition-all border border-gray-400 hover:border-gray-500"
          type="submit"
          disabled={isBlocked}
        >
          {isBlocked ? `Tunggu ${timer} detik...` : "Login"}
        </button>
        {error && <span className="text-red-500 text-center">{error}</span>}
      </form>
    </div>
  );
}