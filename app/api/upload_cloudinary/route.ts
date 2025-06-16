import { NextResponse } from 'next/server';
import { CloudinaryService } from '@/lib/upload_cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { ensureTempDirectory } from '@/lib/utils/temp-directory';

if (process.env.NODE_ENV !== 'production') {
  ensureTempDirectory();
}

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

    // Create a temporary file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create temporary file path
    const tempDir = join(process.cwd(), 'tmp');
    const tempPath = join(tempDir, file.name);
    
    // Ensure tmp directory exists and write file
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
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
