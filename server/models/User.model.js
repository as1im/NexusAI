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
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
