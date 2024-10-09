//src/controllers/packagesController.js

const Package = require("../models/packagesModel");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { bucket } = require("../services/firebaseService");
const mongoose = require("mongoose");

exports.getPackagesByClass = async (req, res) => {
  try {
    const { class_id } = req.params;

    // Validate class_id
    if (!class_id) {
      return res.status(400).json({ error: "class_id is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(class_id)) {
      return res.status(400).json({ error: "Invalid class_id format" });
    }

    const packages = await Package.find({ class_id }).populate(
      "subject_id",
      "subject_name"
    );

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages by class_id:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate(
      "subject_id",
      "subject_name"
    );
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
};
exports.createPackage = async (req, res) => {
  try {
    const { package_name, description, features, class_id, subject_id, price } =
      req.body;

    if (
      !package_name ||
      !description ||
      !features ||
      !class_id ||
      !subject_id ||
      !price
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    let featuresArray;
    try {
      featuresArray = JSON.parse(features);
    } catch (error) {
      return res.status(400).json({ error: "Invalid features format" });
    }

    let subjectIdsArray;
    try {
      subjectIdsArray = JSON.parse(subject_ids);
      if (!Array.isArray(subjectIdsArray) || subjectIdsArray.length === 0) {
        return res.status(400).json({ error: "Invalid subject_ids format" });
      }
    } catch (error) {
      return res.status(400).json({ error: "Invalid subject_ids format" });
    }

    const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(filename);
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading file to Firebase:", error);
      return res.status(500).json({ error: "File upload error" });
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${filename}?alt=media`;

      const newPackage = new Package({
        package_name,
        image: publicUrl,
        description,
        features,
        class_id,
        subject_id: subjectIdsArray,
        price,
      });
      const savedPackage = await newPackage.save();

      res.status(201).json({
        message: "Package created successfully",
        package: savedPackage,
      });
    });
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({
      error: "Server error",
    });
  }
};
