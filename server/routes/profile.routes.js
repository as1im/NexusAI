import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();

// GET /api/profile
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('name email avatarUrl profile');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        profile: user.profile || {
          phone: '',
          website: '',
          linkedin: '',
          github: '',
          summary: '',
          skills: [],
          experience: [],
          projects: [],
          education: []
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/profile
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const { name, avatarUrl, profile } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name !== undefined) user.name = name;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (profile !== undefined) {
      user.profile = {
        phone: profile.phone ?? '',
        website: profile.website ?? '',
        linkedin: profile.linkedin ?? '',
        github: profile.github ?? '',
        summary: profile.summary ?? '',
        skills: profile.skills ?? [],
        experience: profile.experience ?? [],
        projects: profile.projects ?? [],
        education: profile.education ?? []
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
