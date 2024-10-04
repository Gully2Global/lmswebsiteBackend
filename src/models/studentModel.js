const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true, unique: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  role: { type: String, enum: ["student", "admin"], required: true },


});

module.exports = mongoose.model("Student", studentSchema);