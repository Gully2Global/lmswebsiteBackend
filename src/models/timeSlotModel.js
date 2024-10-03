const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the TimeSlot model
const timeSlotSchema = new Schema({
  //   teacher: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Teacher', // Assuming your teachersApplicationModel is named 'Teacher'
  //     required: true
  //   },
  time_slot: {
    type: {
      start: Date,
      end: Date
    },
    required: true,
    _id: false,
  },
  created_time: {
    type: Date,
    default: Date.now // Automatically set the created time
  },
  approval_status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

// Create and export the model
module.exports = mongoose.model('TimeSlot', timeSlotSchema);