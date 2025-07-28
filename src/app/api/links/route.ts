import { NextRequest, NextResponse } from 'next/server';
import Link from '@/models/Link';
import { connectToDatabase } from '@/lib/mongodb';

function requireAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const links = await Link.find().sort({ order: 1 });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { title, href, image, type } = await req.json();
  const link = await Link.create({ title, href, image, type });
  return NextResponse.json(link, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { links, deletedIds } = await req.json();
  console.log("PUT /api/links received links:", links);
  console.log("PUT /api/links received deletedIds:", deletedIds);

  for (const link of links) {
    if (link._id) {
      console.log("Updating link:", link);
      await Link.findByIdAndUpdate(link._id, link);
    } else {
      console.log("Creating link:", link);
      await Link.create(link);
    }
  }
  if (Array.isArray(deletedIds) && deletedIds.length > 0) {
    console.log("Deleting links with IDs:", deletedIds);
    await Link.deleteMany({ _id: { $in: deletedIds } });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { _id } = await req.json();
  await Link.findByIdAndDelete(_id);
  return NextResponse.json({ success: true });
}