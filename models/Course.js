// financial-server/models/Course.js
const mongoose = require('mongoose');

// This schema defines the structure for a single quiz.
const quizSchema = new mongoose.Schema({
  question: { 
    type: String, 
    required: true 
  },
  options: { 
    type: [String], 
    required: true, 
    // This validator ensures there are exactly 4 options.
    validate: {
      validator: (v) => v.length === 4,
      message: 'A quiz must have exactly 4 options.'
    }
  },
  correctAnswer: { 
    type: String, 
    required: true 
  },
});

// This schema defines the structure for a single course.
const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  youtubePlaylistId: { 
    type: String, 
    required: true 
  }, 
  quizzes: { 
    type: [quizSchema],
    // This validator ensures there are exactly 5 quizzes, or zero if optional.
    validate: {
      validator: (v) => v.length === 5 || v.length === 0,
      message: 'A course must have exactly 5 quizzes or none at all.'
    }
  },
});

module.exports = mongoose.model('Course', courseSchema);