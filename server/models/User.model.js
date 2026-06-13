import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false
  },
  name: {
    type: String,
    trim: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatarUrl: {
    type: String
  },
  profile: {
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: { type: [String], default: [] },
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
    }]
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;

