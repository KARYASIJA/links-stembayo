import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = formData.get('fileName') as string;

  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder: '/links_stembayo',
    });
    return NextResponse.json({ url: result.url, name: result.name });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}