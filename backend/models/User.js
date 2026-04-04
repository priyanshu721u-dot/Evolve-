// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'investor'],
    default: 'student'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  skills: {
  type: [String],
  default: []
},
  college: String,
  location: String,
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  linkedIn: String,
  github: String,
  website: String
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);