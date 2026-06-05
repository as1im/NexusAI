import jwt from 'jsonwebtoken';

// Authentication Middleware
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (process.env.NODE_ENV === 'development') {
      // For local dev workspace testing if no token is passed
      req.user = { id: '507f1f77bcf86cd799439011', email: 'dev@nexusai.local', name: 'Dev User' };
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing or invalid'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexusai-jwt-fallback-secret-development');
    req.user = decoded; // Contains id, email, name
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is invalid or expired'
    });
  }
};
