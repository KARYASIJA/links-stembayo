import { NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const links = await Link.find().sort({ order: 1 });
  return NextResponse.json(links);
}