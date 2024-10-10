const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  created_time: { type: Date, default: Date.now },
  status: { type: String, default: "paid" },
  payment_id: { type: String },
  order_id: { type: String },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  // user_id: {
  //   // Reference to User model
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // Ensure this matches the name used in User model
  //   required: true,
  // },
  completed: {
    type: Boolean,
  },
  payment_method: {
    type: String,
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
