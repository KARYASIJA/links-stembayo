import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { signJwt } from "@/lib/jwt";

const loginAttempts: Record<string, { count: number; lastAttempt: number }> =
  {};
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 5 * 1000;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `${ip}:${username}`;

  const now = Date.now();
  const attempt = loginAttempts[key] || { count: 0, lastAttempt: 0 };
   if (attempt.count >= MAX_ATTEMPTS && now - attempt.lastAttempt < BLOCK_TIME) {
    const waitSec = Math.ceil((BLOCK_TIME - (now - attempt.lastAttempt)) / 1000);
    return NextResponse.json(
      {
        error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${waitSec} detik.`,
      },
      { status: 429 }
    );
  }
  await connectToDatabase();
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    loginAttempts[key] = {
      count: attempt.count + 1,
      lastAttempt: now,
    };
    return NextResponse.json({ error: "User atau password salah" }, { status: 401 });
  }
  loginAttempts[key] = { count: 0, lastAttempt: 0 };

  const token = signJwt({ username: user.username });
  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000`,
      },
    }
  );
}