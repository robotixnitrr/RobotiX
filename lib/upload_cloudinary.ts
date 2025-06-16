import cloudinary from '@/lib/cloudinary';
import { unlink } from 'fs/promises';

interface UploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'thumb' | 'crop';
  quality?: number;
  resource_type?: 'auto' | 'image' | 'video' | 'raw';
}

interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
}

export class CloudinaryService {
  /**
   * Upload a file to Cloudinary
   */
  static async uploadFile(
    filePath: string,
    options: UploadOptions = {}
  ): Promise<UploadResponse> {
    try {
      const defaultOptions: UploadOptions = {
        folder: 'uploads',
        resource_type: 'auto',
        ...options,
      };

      const result = await cloudinary.uploader.upload(filePath, defaultOptions);

      // Clean up the temporary file
      await unlink(filePath);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('File upload failed');
    }
  }

  /**
   * Delete a file from Cloudinary
   */
  static async deleteFile(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('File deletion failed');
    }
  }

  /**
   * Get optimized URL with transformations
   */
  static getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: string;
    } = {}
  ): string {
    const { width, height, quality = 'auto', format = 'auto' } = options;

    const transformations = [];

    if (width || height) {
      transformations.push(`c_fill,${width ? `w_${width}` : ''},${height ? `h_${height}` : ''}`);
    }

    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  }
}