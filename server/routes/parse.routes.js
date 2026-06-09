import express from 'express';
import { validateGitHubUrl } from '../middleware/validate.middleware.js';
import { fetchGitHubData } from '../services/github.service.js';
import { parsePdfContent } from '../services/pdf.service.js';
import { structureProfile } from '../services/gemini.service.js';

const router = express.Router();

// POST /api/parse/github
router.post('/github', validateGitHubUrl, async (req, res, next) => {
  try {
    const { githubUrl } = req.body;
    const githubData = await fetchGitHubData(githubUrl);
    
    res.status(200).json({
      success: true,
      message: 'GitHub data parsed successfully',
      data: githubData
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/parse/linkedin
router.post('/linkedin', async (req, res, next) => {
  try {
    if (!req.files || !req.files.linkedinPdf) {
      return res.status(400).json({
        success: false,
        message: 'No LinkedIn PDF file uploaded.'
      });
    }

    const pdfFile = req.files.linkedinPdf;
    
    // Parse raw text from the uploaded PDF file
    const rawText = await parsePdfContent(pdfFile.tempFilePath);
    
    // Use Gemini AI to structure the unstructured resume text into standard JSON schema
    const structuredProfile = await structureProfile(rawText);
    
    res.status(200).json({
      success: true,
      message: 'LinkedIn PDF parsed and structured successfully',
      data: structuredProfile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
