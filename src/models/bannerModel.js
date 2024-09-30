const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  banner_image: { type: String, required: true },
  banner_name: { type: String, required: true },
  created_time: {
    type: Date,
    default: Date.now,
  },
  is_active: { type: Boolean, default: false },

});

module.exports = mongoose.model("Banner", bannerSchema);
