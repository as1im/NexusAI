// Request Validation Middleware
export const validateGitHubUrl = (req, res, next) => {
  const { githubUrl } = req.body;
  if (!githubUrl) {
    return res.status(400).json({
      success: false,
      message: 'GitHub profile URL is required.'
    });
  }

  // Simple github URL pattern check
  const githubPattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
  if (!githubPattern.test(githubUrl.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub profile URL format. E.g. https://github.com/username'
    });
  }

  next();
};

export const validateGenerateInput = (req, res, next) => {
  const { profile, jobDescription } = req.body;
  if (!profile || !jobDescription) {
    return res.status(400).json({
      success: false,
      message: 'Profile data and job description are required for optimization.'
    });
  }
  next();
};
