// Authentication Middleware Stub
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // NOTE: This is a placeholder validation. We will implement proper verification
  // of NextAuth JWT or sessions once front/back authentication is fully integrated.
  if (process.env.NODE_ENV === 'development') {
    // For local dev, attach a mock user if no auth header is present (using a valid 24-character hex ObjectId)
    req.user = { id: '507f1f77bcf86cd799439011', email: 'dev@nexusai.local', name: 'Dev User' };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing or invalid'
    });
  }

  // Example: Extract token and decode (stub)
  const token = authHeader.split(' ')[1];
  req.user = { id: 'extracted-user-id', token }; // stub placeholder
  next();
};
