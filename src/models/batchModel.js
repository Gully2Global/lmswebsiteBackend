const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batch_name: { type: String, required: true },
  start_date: { type: Date, required: true },
  no_of_classes: { type: Number, required: true },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  contentMaterial: { type: String, },
  date: { type: Date, default: Date.now },
  no_of_participant: { type: Number, default: 0 },
  meeting_link: { type: String, required: true },
});

module.exports = mongoose.model("Batch", batchSchema);
