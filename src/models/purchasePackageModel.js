const mongoose = require("mongoose");

const purchasePackageSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  payment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  is_payment_completed: {
    type: Boolean,
  },
});

module.exports = mongoose.model("PurchasePackage", purchasePackageSchema);
