import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { signJwt } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  await connectToDatabase();
  const user = await User.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }
  const token = signJwt({ username: user.username });
  return NextResponse.json({ success: true }, {
    headers: {
      'Set-Cookie': `token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`
    }
  });
}