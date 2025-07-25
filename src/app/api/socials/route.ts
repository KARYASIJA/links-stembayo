import { NextRequest, NextResponse } from 'next/server';
import Social from '@/models/Social';
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
  console.log("[API] GET /api/socials called");
  const socials = await Social.find().sort({ order: 1 });
  console.log("[API] GET /api/socials result:", socials);
  return NextResponse.json(socials);
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { title, href, icon } = await req.json();
  console.log("[API] POST /api/socials payload:", { title, href, icon });
  const social = await Social.create({ title, href, icon });
  console.log("[API] POST /api/socials created:", social);
  return NextResponse.json(social, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { socials, deletedIds } = await req.json();
  console.log("[API] PUT /api/socials received socials:", socials);
  console.log("[API] PUT /api/socials received deletedIds:", deletedIds);

  for (const social of socials) {
    if (social._id) {
      console.log("[API] PUT updating social:", social);
      await Social.findByIdAndUpdate(social._id, social);
    } else {
      console.log("[API] PUT creating social:", social);
      await Social.create(social);
    }
  }
  if (Array.isArray(deletedIds) && deletedIds.length > 0) {
    console.log("[API] PUT deleting socials with IDs:", deletedIds);
    await Social.deleteMany({ _id: { $in: deletedIds } });
  }
  console.log("[API] PUT /api/socials finished");
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  await connectToDatabase();
  const { _id } = await req.json();
  console.log("[API] DELETE /api/socials _id:", _id);
  await Social.findByIdAndDelete(_id);
  console.log("[API] DELETE /api/socials deleted:", _id);
  return NextResponse.json({ success: true });
}