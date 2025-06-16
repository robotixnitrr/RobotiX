import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import cloudinary from '@/lib/cloudinary';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useAuth } from '@/hooks/use-auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user } = useAuth()

  if (user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });

    const uploaded = files.file;
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // Delete previous avatar if exists
      const user_ = await db.query.users.findFirst({
        where: eq(users.email, user?.email || ""),
      });


      // Upload new avatar
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'avatars',
        width: 300,
        height: 300,
        crop: 'fill',
      });

      // Update user record
      await db
        .update(users)
        .set({
          avatarUrl: result.secure_url,
          // avatarPublicId: result.public_id,
        })
        .where(eq(users.email, user?.email || ""));

      res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}