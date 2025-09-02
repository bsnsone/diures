import { Storage } from 'megajs';
import { MEGA_CONFIG } from './lib/mega_env.js';

export default async function handler(req, res) {
  try {
    const storage = new Storage({
      email: MEGA_CONFIG.email,
      password: MEGA_CONFIG.password
    });

    storage.on('ready', async () => {
      // Ensure "test_api" folder exists
      let folder = storage.root.children.find(c => c.name === 'test_api');
      if (!folder) {
        folder = await new Promise((resolve, reject) => {
          storage.mkdir({ name: 'test_api' }, (err, f) => {
            if (err) reject(err);
            else resolve(f);
          });
        });
      }

      // ------------------ POST: Upload file ------------------
      // ------------------ POST: Upload file ------------------
if (req.method === 'POST') {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const fileBuffer = Buffer.concat(chunks);

    const fileName = req.headers['x-filename'] || 'uploaded_file';

    // ======== SIZE LIMIT CHECK ========
    const MAX_SIZE = 7 * 1024 * 1024; // 7MB in bytes
    if (fileBuffer.length > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum allowed size is 7MB.`
      });
    }

    const uploaded = folder.upload(fileName, fileBuffer);

    uploaded.on('complete', file => {
      console.log('📤 Uploaded:', file.name);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


      // ------------------ GET: List files with download links ------------------
      else if (req.method === 'GET') {
        try {
          const filesWithLinks = await Promise.all(
            folder.children.map(file =>
              new Promise((resolve, reject) => {
                file.link((err, url) => {
                  if (err) reject(err);
                  else resolve({
                    name: file.name,
                    size: file.size,
                    createdAt: file.timestamp,
                    url
                  });
                });
              })
            )
          );

          res.status(200).json({
            success: true,
            files: filesWithLinks
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      }

      // ------------------ OTHER METHODS ------------------
      else {
        res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
