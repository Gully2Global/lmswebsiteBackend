const mongoose = require("mongoose");

const queriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  dateQueried: {
    type: Date,
    default: Date.now,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  querySolved: {
    type: Boolean,
    default: false,
  },
  attendedBy: {
    type: String,
  },
  queryStatus: {
    type: String,
    enum: ["pending", "solved"],
    default: "pending",
  },
});

module.exports = mongoose.model("Queries", queriesSchema);
