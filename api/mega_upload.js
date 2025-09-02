// api/mega_upload.js

import { IncomingForm } from "formidable";
import fs from "fs";
import { file } from "megajs";
import mega from "megajs";
import creds from "./lib/mega_env";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const { filepath, originalFilename } = files.file; // Expecting 'file' field
    try {
      // Login to Mega
      const storage = await new mega.Storage({
        email: creds.email,
        password: creds.password,
      }).ready;

      // Ensure folder exists
      let folder = storage.root.children.find(c => c.name === creds.folderName);
      if (!folder) {
        folder = await storage.mkdir(creds.folderName);
      }

      // Upload file
      const uploadStream = folder.upload({ name: originalFilename });
      fs.createReadStream(filepath).pipe(uploadStream);

      uploadStream.complete(async () => {
        res.status(200).json({ message: "Upload successful", file: originalFilename });
      });
    } catch (uploadError) {
      res.status(500).json({ error: "Upload failed", details: uploadError.message });
    }
  });
}
