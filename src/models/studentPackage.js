const mongoose = require("mongoose");

const studentPackageSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expiry_date: {
    type: Date,
  },
  is_active: {
    type: Boolean,
  },
});

module.exports = mongoose.model("StudentPackage", studentPackageSchema)