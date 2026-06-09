import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be null/optional for guest/unauthenticated users
  },
  jobTitle: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: false
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    website: String,
    linkedin: String,
    github: String
  },
  experience: [{
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String,
    highlights: [String]
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    url: String,
    stars: Number
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: String,
    endDate: String
  }],
  skills: [String],
  atsScore: {
    type: Number,
    default: 0
  },
  atsScoreBefore: {
    type: Number,
    default: 0
  },
  matchedKeywords: [String],
  missingKeywords: [String],
  pdfUrl: String,
  docxUrl: String
}, {
  timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
