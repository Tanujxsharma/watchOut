const { nanoid } = require('nanoid');
const mime = require('mime-types');
const cloudinary = require('../config/cloudinary');

async function uploadBase64Documents(documents = []) {
  if (!Array.isArray(documents) || !documents.length) {
    return [];
  }

  const uploads = documents.map(async (document) => {
    const payload = typeof document === 'string' ? { base64: document } : document;

    if (!payload?.base64) {
      throw new Error('Invalid document payload. Expecting base64 string.');
    }

    const fileName = payload.fileName || `document-${nanoid(8)}`;

    const upload = await cloudinary.uploader.upload(payload.base64, {
      folder: 'watchout/company-documents',
      public_id: `${fileName}-${Date.now()}`,
      resource_type: 'auto'
    });

    return {
      url: upload.secure_url,
      publicId: upload.public_id,
      bytes: upload.bytes,
      format: upload.format,
      fileName,
      mimeType: mime.lookup(upload.format) || 'application/octet-stream'
    };
  });

  return Promise.all(uploads);
}

module.exports = {
  uploadBase64Documents
};

