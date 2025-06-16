import { NextResponse } from 'next/server';
import { CloudinaryService } from '@/lib/upload_cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { TEMP_DIR } from '@/lib/utils/temp-directory';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use the TEMP_DIR constant
    const tempPath = join(TEMP_DIR, `${Date.now()}-${file.name}`);
    
    await writeFile(tempPath, buffer);

    const result = await CloudinaryService.uploadFile(tempPath, {
      folder: 'avatars',
      width: 300,
      height: 300,
      crop: 'fill',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}