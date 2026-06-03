import express from 'express';
import { validateGitHubUrl } from '../middleware/validate.middleware.js';
// We'll import services later, for now we define route stubs
const router = express.Router();

// POST /api/parse/github
router.post('/github', validateGitHubUrl, async (req, res, next) => {
  try {
    const { githubUrl } = req.body;
    // TODO: Call github.service to fetch repo list and README info
    res.status(200).json({
      success: true,
      message: 'GitHub data parsed successfully (stub)',
      data: {
        username: githubUrl.split('/').pop(),
        repositories: [
          { name: 'example-repo', language: 'JavaScript', stars: 10, description: 'An example repo' }
        ]
      }
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
    // TODO: Call pdf.service for extraction and gemini.service for formatting
    
    res.status(200).json({
      success: true,
      message: 'LinkedIn PDF parsed and structured successfully (stub)',
      data: {
        personalInfo: { name: 'John Doe', email: 'john@example.com' },
        experience: [
          { company: 'Acme Corp', role: 'Software Engineer', duration: '2 years' }
        ],
        skills: ['JavaScript', 'Node.js', 'React']
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
