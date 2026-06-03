import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import Resume from '../models/Resume.model.js';

const router = express.Router();

// GET /api/resumes (History)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('jobTitle atsScore createdAt');
      
    res.status(200).json({
      success: true,
      message: 'Resume history retrieved successfully',
      data: resumes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/resumes/:id
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOne({ _id: id, userId: req.user.id });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume details retrieved successfully',
      data: resume
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/resumes/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOneAndDelete({ _id: id, userId: req.user.id });
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
