import { mkdir } from 'fs/promises';
import { join } from 'path';

export const TEMP_DIR = join(process.cwd(), 'tmp');

export async function ensureTempDirectory() {
  try {
    await mkdir(TEMP_DIR, { recursive: true });
    console.log('Temporary directory ensured at:', TEMP_DIR);
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}