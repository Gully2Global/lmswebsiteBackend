// src/models/responseModel.js

const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
    required: true,
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // Reference to the Quiz model
    required: true,
  },
  responses: [
    {
      question_number: {
        type: Number,
        required: true,
      },
      selected_option_id: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
  submitted_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', responseSchema);
