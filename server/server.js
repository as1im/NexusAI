import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import rateLimitMiddleware from './middleware/rateLimit.middleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max limit
}));

// Apply global rate limiting
app.use(rateLimitMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Import route modules
import parseRoutes from './routes/parse.routes.js';
import generateRoutes from './routes/generate.routes.js';
import resumeRoutes from './routes/resume.routes.js';

// Register routes
app.use('/api/parse', parseRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/resumes', resumeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      mongoose.connect(mongoUri)
        .then(() => console.log('Successfully connected to MongoDB.'))
        .catch(err => {
          console.warn('⚠️ MongoDB connection failed. Database operations will be unavailable.');
          console.error(err.message || err);
        });
    } else {
      console.warn('⚠️ MONGODB_URI is not defined. Database operations will fail.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
