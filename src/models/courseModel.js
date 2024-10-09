const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the subject
    ref: "Subject", // Model name for subject
    required: true,
  },
  noOfSubjects: {
    type: Number,
  },

  class: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the class
    ref: "Class",
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model("Course", courseSchema);
