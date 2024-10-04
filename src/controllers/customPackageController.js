// src/controllers/customPackageController.js

const CustomPackage = require("../models/customPackageModels");
const mongoose = require("mongoose");

// Controller for creating a custom package
exports.createCustomPackage = async (req, res) => {
  try {
    let {
      user_id,
      expiry_date,
      is_active,
      student_id,
      subject_id,
      // The student should not set admin-related fields
    } = req.body;

    // Ensure subject_id is an array and has at least 3 subjects
    if (!Array.isArray(subject_id) || subject_id.length < 3) {
      return res
        .status(400)
        .json({ error: "At least 3 subjects are required" });
    }

    // Convert subject_ids to ObjectId instances
    const objectIdSubjects = subject_id.map((subject) => {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        throw new Error("Invalid subject ID");
      }
      return new mongoose.Types.ObjectId(subject);
    });

    // Validate and convert user_id and student_id
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      throw new Error("Invalid user ID");
    }
    const userId = new mongoose.Types.ObjectId(user_id);

    let studentId;
    if (student_id) {
      if (!mongoose.Types.ObjectId.isValid(student_id)) {
        throw new Error("Invalid student ID");
      }
      studentId = new mongoose.Types.ObjectId(student_id);
    }

    // Create a new custom package with default values for admin-related fields
    const newCustomPackage = new CustomPackage({
      user_id: userId,
      expiry_date,
      is_active,
      student_id: studentId,
      subject_id: objectIdSubjects,
      is_approved: false,
      package_price: 0,
      is_price_finalized: false,
      admin_contacted: false,
      admin_notes: "",
    });

    const savedCustomPackage = await newCustomPackage.save();

    res.status(201).json({
      message: "Custom package created successfully",
      customPackage: savedCustomPackage,
    });
  } catch (error) {
    console.error("Error creating custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for updating a custom package (admin use)
exports.updateCustomPackage = async (req, res) => {
  try {
    const { package_id } = req.params;
    const {
      is_approved,
      package_price,
      is_price_finalized,
      admin_contacted,
      admin_notes,
      is_active,
      expiry_date,
    } = req.body;

    // Find the custom package by ID
    const customPackage = await CustomPackage.findById(package_id);
    if (!customPackage) {
      return res.status(404).json({ error: "Custom package not found" });
    }

    // Update the fields if they are provided
    if (is_approved !== undefined) customPackage.is_approved = is_approved;
    if (package_price !== undefined)
      customPackage.package_price = package_price;
    if (is_price_finalized !== undefined)
      customPackage.is_price_finalized = is_price_finalized;
    if (admin_contacted !== undefined)
      customPackage.admin_contacted = admin_contacted;
    if (admin_notes !== undefined) customPackage.admin_notes = admin_notes;
    if (is_active !== undefined) customPackage.is_active = is_active;
    if (expiry_date !== undefined) customPackage.expiry_date = expiry_date;

    await customPackage.save();

    res.status(200).json({
      message: "Custom package updated successfully",
      customPackage,
    });
  } catch (error) {
    console.error("Error updating custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for getting all custom packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await CustomPackage.find()
      .populate("user_id", "name email")
      .populate("student_id", "name email")
      .populate("subject_id", "subject_name")
      .exec();

    res.status(200).json({
      message: "Custom packages fetched successfully",
      packages,
    });
  } catch (error) {
    console.error("Error fetching custom packages:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

// Controller for getting a single custom package by ID
exports.getCustomPackageById = async (req, res) => {
  try {
    const { package_id } = req.params;

    const customPackage = await CustomPackage.findById(package_id)
      .populate("user_id", "name email")
      .populate("student_id", "name email")
      .populate("subject_id", "subject_name")
      .exec();

    if (!customPackage) {
      return res.status(404).json({ error: "Custom package not found" });
    }

    res.status(200).json({
      message: "Custom package fetched successfully",
      customPackage,
    });
  } catch (error) {
    console.error("Error fetching custom package:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
