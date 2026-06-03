import express from 'express';
import { validateGenerateInput } from '../middleware/validate.middleware.js';
import Resume from '../models/Resume.model.js';

const router = express.Router();

// POST /api/generate
router.post('/', validateGenerateInput, async (req, res, next) => {
  try {
    const { profile, jobDescription } = req.body;
    
    // TODO:
    // 1. Call gemini.service to match experiences and generate bullet points
    // 2. Call ats.service to calculate the ATS match scores
    // 3. Create PDF and DOCX documents via puppeteer.service and docx.service
    // 4. Upload files to cloudinary.service
    
    // Optional User Authentication (doesn't block guest flow)
    let userId = null;
    if (process.env.NODE_ENV === 'development') {
      userId = '507f1f77bcf86cd799439011'; // Mock user ID for dev
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      userId = 'extracted-user-id'; // In production, decode real token
    }

    const resumeData = {
      userId,
      jobTitle: profile.jobTitle || 'Optimized Resume',
      personalInfo: profile.personalInfo || { name: 'John Doe' },
      experience: profile.experience || [],
      projects: profile.projects || [],
      skills: profile.skills || [],
      atsScore: 85,
      atsScoreBefore: 45,
      matchedKeywords: ['React', 'Node.js', 'Express.js'],
      missingKeywords: ['CI/CD', 'Docker'],
      pdfUrl: 'https://cloudinary.com/dummy-pdf-link.pdf',
      docxUrl: 'https://cloudinary.com/dummy-docx-link.docx'
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
