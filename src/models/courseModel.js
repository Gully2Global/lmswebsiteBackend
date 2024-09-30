const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the subject
    ref: 'Subject', // Model name for subject
    required: true
  },

  class: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the class
    ref: 'Class', // Model name for class
    required: true
  },

  price: {
    type: Number,
    required: true
  },

});

// Export the model
module.exports = mongoose.model('Course', courseSchema);
