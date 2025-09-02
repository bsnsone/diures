import { Storage } from 'megajs';
import { MEGA_CONFIG } from './lib/mega_env.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    // 1. Init Mega session
    const storage = new Storage({
      email: MEGA_CONFIG.email,
      password: MEGA_CONFIG.password
    });

    storage.on('ready', async () => {
      console.log('✅ Logged into Mega');

      // 2. Ensure "test_api" folder exists
      let folder = storage.root.children.find(c => c.name === 'test_api');
      if (!folder) {
        folder = await new Promise((resolve, reject) => {
          storage.mkdir({ name: 'test_api' }, (err, f) => {
            if (err) reject(err);
            else resolve(f);
          });
        });
      }

      // 3. File buffer from request (frontend must send raw body or base64)
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const fileBuffer = Buffer.concat(chunks);

      const fileName = req.headers['x-filename'] || 'uploaded_file';

      // 4. Upload into Mega
      const uploaded = folder.upload(fileName, fileBuffer);

      uploaded.on('complete', file => {
        console.log('📤 File uploaded:', file.name);
        file.link((err, url) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(200).json({
            success: true,
            file: file.name,
            size: file.size,
            url
          });
        });
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
