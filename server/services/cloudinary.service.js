import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a local file to Cloudinary storage
 * @param {string} localFilePath - Local absolute path to the generated document
 * @param {string} [folder='resumes'] - Folder destination on Cloudinary
 * @returns {Promise<string>} Secure URL of the uploaded asset
 */
export const uploadFile = async (localFilePath, folder = 'resumes') => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary credentials missing. Returning local fallback URI.');
    return `file://${localFilePath}`; // local fallback for testing
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `nexusai/${folder}`,
      resource_type: 'auto', // Auto-detect file type (PDF/DOCX)
      use_filename: true,
      unique_filename: true
    });

    return response.secure_url;
  } catch (error) {
    console.error('[Cloudinary Upload Error]:', error);
    throw new Error(`Failed to upload document to Cloudinary: ${error.message}`);
  }
};
