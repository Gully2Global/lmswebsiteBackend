// controllers/payoutController.js
const Payout = require("../models/payoutModel");
const Teacher = require("../models/teacherModel"); // Assuming you have a Teacher model

// Create a new payout
exports.createPayout = async (req, res) => {
  try {
    const { teacher_id, amount, date, is_pending, is_paid } = req.body;

    // Validate required fields
    if (!teacher_id || !amount) {
      return res
        .status(400)
        .json({ error: "teacher_id and amount are required." });
    }

    // Optional: Validate that the teacher exists
    const teacherExists = await Teacher.findById(teacher_id);
    if (!teacherExists) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    // Create a new Payout document
    const newPayout = new Payout({
      teacher_id,
      amount,
      date,
      is_pending: is_pending !== undefined ? is_pending : true,
      is_paid: is_paid !== undefined ? is_paid : false,
    });

    // Save the payout to the database
    const savedPayout = await newPayout.save();

    res.status(201).json(savedPayout);
  } catch (error) {
    console.error("Error creating payout:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// Get all payouts
exports.getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate({
        path: "teacher_id",
        select: "user_id",
        populate: {
          path: "user_id",
          select: "name email",
        },
      })
      .sort({ date: -1 }); 

    res.status(200).json(payouts);
  } catch (error) {
    console.error("Error fetching payouts:", error);
    res.status(500).json({ error: "Server error." });
  }
};


exports.getPayoutById = async (req, res) => {
  try {
    const { id } = req.params;

    const payout = await Payout.findById(id).populate({
      path: "teacher_id",
      select: "user_id",
      populate: {
        path: "user_id",
        select: "name email",
      },
    });

    if (!payout) {
      return res.status(404).json({ error: "Payout not found." });
    }

    res.status(200).json(payout);
  } catch (error) {
    console.error("Error fetching payout:", error);
    res.status(500).json({ error: "Server error." });
  }
};


exports.updatePayout = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    
    const payoutExists = await Payout.findById(id);
    if (!payoutExists) {
      return res.status(404).json({ error: "Payout not found." });
    }

    
    const updatedPayout = await Payout.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedPayout);
  } catch (error) {
    console.error("Error updating payout:", error);
    res.status(500).json({ error: "Server error." });
  }
};


exports.deletePayout = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayout = await Payout.findByIdAndDelete(id);

    if (!deletedPayout) {
      return res.status(404).json({ error: "Payout not found." });
    }

    res.status(200).json({ message: "Payout deleted successfully." });
  } catch (error) {
    console.error("Error deleting payout:", error);
    res.status(500).json({ error: "Server error." });
  }
};
