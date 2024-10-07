//src/controllers/batchController.js

const Batch = require("../models/batchModel");

exports.createBatch = async (req, res) => {
  try {
    const {
      batch_name,
      start_date,
      no_of_classes,
      teacher_id,
      student_ids,
      contentMaterial,
      date,
    } = req.body;
    if (
      !batch_name ||
      !start_date ||
      !no_of_classes ||
      !teacher_id ||
      !student_ids ||
      !contentMaterial ||
      !date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newBatch = new Batch({
      batch_name,
      start_date,
      no_of_classes,
      teacher_id,
      student_ids,
      contentMaterial,
      date,
    });
    await newBatch.save();
    res.status(201).json({ message: "Batch created successfully" });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ error: "Server error" });
  }
};
