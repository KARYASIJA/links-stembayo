import { NextResponse } from 'next/server';
import Social from '@/models/Social';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const socials = await Social.find().sort({ order: 1 });
  return NextResponse.json(socials);
}