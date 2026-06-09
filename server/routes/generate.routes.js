import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import { validateGenerateInput } from '../middleware/validate.middleware.js';
import Resume from '../models/Resume.model.js';

import { generateTailoredResume } from '../services/gemini.service.js';
import { extractKeywordsFromJd, analyzeAtsScore } from '../services/ats.service.js';
import { generatePdfFromHtml } from '../services/puppeteer.service.js';
import { generateDocxFromData } from '../services/docx.service.js';
import { uploadFile } from '../services/cloudinary.service.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// POST /api/generate
router.post('/', validateGenerateInput, async (req, res, next) => {
  try {
    const { profile, jobDescription } = req.body;
    
    // 1. Extract technical keywords and calculate baseline ATS score
    const jdKeywords = await extractKeywordsFromJd(jobDescription);
    const originalAts = analyzeAtsScore(profile, jdKeywords);
    
    // 2. Call Gemini AI to optimize/tailor the developer profile for the job description
    const tailoredResume = await generateTailoredResume(profile, jobDescription);
    
    // Ensure education history from the original profile is preserved
    if ((!tailoredResume.education || tailoredResume.education.length === 0) && profile.education) {
      tailoredResume.education = profile.education;
    }
    
    // 3. Calculate optimized ATS score after tailoring
    const optimizedAts = analyzeAtsScore(tailoredResume, jdKeywords);
    
    // 4. Compile the HTML template with the tailored resume data
    const templatePath = path.join(__dirname, '../templates/resume.html');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);
    const htmlContent = template(tailoredResume);
    
    // 5. Generate local temporary PDF and DOCX files
    const pdfPath = path.join(os.tmpdir(), `resume-${Date.now()}.pdf`);
    const docxPath = path.join(os.tmpdir(), `resume-${Date.now()}.docx`);
    
    await generatePdfFromHtml(htmlContent, pdfPath);
    await generateDocxFromData(tailoredResume, docxPath);
    
    // 6. Upload generated documents to Cloudinary (will fall back to file:// URIs if credentials are not configured)
    const pdfUrl = await uploadFile(pdfPath, 'resumes');
    const docxUrl = await uploadFile(docxPath, 'resumes');
    
    // 7. Clean up local files
    try {
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      if (fs.existsSync(docxPath)) fs.unlinkSync(docxPath);
    } catch (err) {
      console.warn('[Cleanup Warning] Failed to delete local temp files:', err.message);
    }
    
    // 8. Extract real user ID from auth headers if present
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexusai-jwt-fallback-secret-development');
        userId = decoded.id;
      } catch (err) {
        console.warn('[Generate Route] Token verification failed:', err.message);
      }
    }
    if (!userId && process.env.NODE_ENV === 'development') {
      userId = '507f1f77bcf86cd799439011'; // Mock user ID fallback for dev workspace
    }
    
    // 9. Persist the resume details in MongoDB
    const resumeData = {
      userId,
      jobTitle: tailoredResume.jobTitle || profile.jobTitle || 'Optimized Resume',
      summary: tailoredResume.summary || '',
      personalInfo: tailoredResume.personalInfo || profile.personalInfo,
      experience: tailoredResume.experience || [],
      projects: tailoredResume.projects || [],
      education: tailoredResume.education || [],
      skills: tailoredResume.skills || [],
      atsScore: optimizedAts.score,
      atsScoreBefore: originalAts.score,
      matchedKeywords: optimizedAts.matched,
      missingKeywords: optimizedAts.missing,
      pdfUrl,
      docxUrl
    };
    
    const savedResume = await Resume.create(resumeData);
    
    res.status(200).json({
      success: true,
      message: 'ATS-optimized resume generated and saved successfully',
      data: {
        _id: savedResume._id,
        resume: savedResume,
        atsScore: savedResume.atsScore,
        atsScoreBefore: savedResume.atsScoreBefore,
        matchedKeywords: savedResume.matchedKeywords,
        missingKeywords: savedResume.missingKeywords,
        pdfUrl: savedResume.pdfUrl,
        docxUrl: savedResume.docxUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
