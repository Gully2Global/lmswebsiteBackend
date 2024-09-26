// src/controllers/classController.js

const Class = require("../models/classModel");

// Create a new class/subject
exports.createClass = async (req, res) => {
  try {
    const { className, classLevel, curriculum } = req.body;

    if (!className || !classLevel || !curriculum) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newClass = new Class({
      className,
      classLevel,
      curriculum,
    });

    await newClass.save();
    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all classes/subjects
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a class/subject
exports.updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { className, classLevel, curriculum } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { className, classLevel, curriculum },
      { new: true } // Returns the updated document
    );

    if (!updatedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a class/subject
exports.deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const deletedClass = await Class.findByIdAndDelete(classId);

    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ error: "Server error" });
  }
};
