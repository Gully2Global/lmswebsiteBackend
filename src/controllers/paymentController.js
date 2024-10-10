// src/controllers/paymentController.js

const mongoose = require("mongoose"); // Ensure mongoose is imported
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid"); // Use destructuring for clarity

const Student = require("../models/studentModel");

// Create a new payment
exports.createPayment = async (req, res) => {
  const { amount, student_id, package_id, payment_method } = req.body;
  const payment_id = uuidv4(); // Use uuidv4 for generating unique payment IDs
  try {
    const newPayment = new Payment({
      amount,
      payment_id,
      student_id,
      package_id,
      payment_method,
      is_paid: false,
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment)
      return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all payments with optional filters
exports.getAllPayments = async (req, res) => {
  const { student_id, payment_id, page = 1, limit = 10 } = req.query;

  console.log("Received getAllPayments request with:", req.query); // Debug log

  // Build the filter object based on provided query parameters
  let filter = {};
  if (student_id) {
    if (!mongoose.Types.ObjectId.isValid(student_id)) {
      console.log("Invalid student_id format:", student_id); // Debug log
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    filter.student_id = student_id;
  }
  if (payment_id) {
    filter.payment_id = payment_id;
  }

  console.log("Filter applied:", filter); // Debug log

  try {
    const payments = await Payment.find(filter)
      .populate({
        path: "student_id",
        populate: {
          path: "user_id",
          select: "name", // Only select the 'name' field from User
        },
      })
      .populate("package_id", "package_name") // Populate package details
      .skip((page - 1) * limit) // Pagination
      .limit(parseInt(limit))
      .exec();

    const total = await Payment.countDocuments(filter); // Total count for pagination

    console.log("Fetched payments:", payments); // Debug log

    res.status(200).json({
      total,
      page: parseInt(page),
      pageSize: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get payment details by payment_id
exports.getPaymentDetails = async (req, res) => {
  const { payment_id } = req.params;
  try {
    const payment = await Payment.findOne({ payment_id })
      .populate({
        path: "student_id",
        populate: {
          path: "user_id",
          select: "name",
        },
      })
      .populate({
        path: "package_id",
        populate: {
          path: "package_name",
        },
      })
      .exec();
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
