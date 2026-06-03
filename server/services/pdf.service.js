import fs from 'fs';
import pdf from 'pdf-parse';

/**
 * Extracts raw textual contents from a PDF document
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} Raw text parsed from the PDF
 */
export const parsePdfContent = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parsedData = await pdf(dataBuffer);
    return parsedData.text || '';
  } catch (error) {
    console.error('[PDF Service Error]:', error);
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
};
