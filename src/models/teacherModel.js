const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  teacher_id: { type: String, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["teacher", "admin"], required: true }, // No need for 'student' here if it's specific to teachers

  qualifications: { type: String },
  bio: { type: String },
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  resume_link: { type: String },
  payout_info: { type: String },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  last_online: { type: Date, default: Date.now, required: true },
  experience: { type: String, required: true },
  no_of_classes: { type: Number, required: true },
  available_time: { type: String, required: true },
  language: { type: String, required: true },
  is_grammar_teacher: { type: Boolean, default: false },
});

module.exports = mongoose.model("Teacher", teacherSchema);
