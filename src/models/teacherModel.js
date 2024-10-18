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
  role: { type: String, enum: ["teacher", "admin"], required: true },




  qualifications: { type: String },
  bio: { type: String },
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  resume_link: { type: String },
  payout_info: { type: String },
  // Modified subject field to store both ID and name
  subject: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    name: { type: String }
  },
  last_online: { type: Date, default: Date.now },
  experience: { type: String },
  no_of_classes: { type: Number },
  available_time: { type: String },
  language: { type: String },
  is_grammar_teacher: { type: Boolean, default: false },
});

module.exports = mongoose.model("Teacher", teacherSchema);
