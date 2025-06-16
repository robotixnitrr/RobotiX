import { mkdir } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export const TEMP_DIR = tmpdir(); // e.g., /tmp on Unix, C:\Users\<user>\AppData\Local\Temp on Windows


export async function ensureTempDirectory() {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    console.log('Temporary directory ensured at:', TEMP_DIR);
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}