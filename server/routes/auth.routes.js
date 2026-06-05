import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const router = express.Router();

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'nexusai-jwt-fallback-secret-development',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // If user registered with GitHub and has no password set
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was registered using GitHub. Please log in with GitHub.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/github
// @desc    Upsert user who authenticated via GitHub OAuth
router.post('/github', async (req, res, next) => {
  try {
    const { email, name, githubId, avatarUrl } = req.body;

    if (!email || !githubId) {
      return res.status(400).json({
        success: false,
        message: 'GitHub email and ID are required'
      });
    }

    // Find user by githubId first
    let user = await User.findOne({ githubId });

    if (!user) {
      // Find user by email (in case they previously registered with credentials)
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Link GitHub to existing account
        user.githubId = githubId;
        if (avatarUrl) user.avatarUrl = avatarUrl;
        if (!user.name && name) user.name = name;
        await user.save();
      } else {
        // Create new user for GitHub OAuth
        user = await User.create({
          email: email.toLowerCase(),
          name: name || email.split('@')[0],
          githubId,
          avatarUrl
        });
      }
    } else {
      // If user exists by githubId, update avatar and email just in case
      let updated = false;
      if (avatarUrl && user.avatarUrl !== avatarUrl) {
        user.avatarUrl = avatarUrl;
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'GitHub authentication completed',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
