const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  auth_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  mobile_number: { type: String },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  profile_picture: { type: String },
  date_joined: { type: Date, default: Date.now },
  class_level: { type: Number }, // Applicable for students
  approval_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  password: { type: String },
  fcmToken: { type: String },
  access_token: { type: String },
  refresh_token: { type: String },
});

module.exports = mongoose.model("User", userSchema);
