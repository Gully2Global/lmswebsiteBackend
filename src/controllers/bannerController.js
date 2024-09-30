// src/controllers/bannerController.js

const { bucket } = require("../services/firebaseService"); // Import Firebase bucket
const Banner = require("../models/bannerModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // To generate unique filenames for Firebase Storage

exports.createBanner = async (req, res) => {
  try {
    const { banner_name } = req.body;

    // Check if the file has been uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Banner image is required" });
    }

    if (!banner_name) {
      return res.status(400).json({ error: "Banner name is required" });
    }

    // Generate a unique filename for Firebase Storage
    const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);

    // Upload the file to Firebase Storage
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        firebaseStorageDownloadTokens: uuidv4(), // Generate a unique token for downloading the file
      },
    });

    blobStream.on("error", (error) => {
      console.error("Error uploading file to Firebase:", error);
      return res.status(500).json({ error: "File upload error" });
    });

    blobStream.on("finish", async () => {
      // File upload is finished, generate the public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileName)}?alt=media`;

      // Save the banner to the database with the Firebase URL
      const newBanner = new Banner({
        banner_image: publicUrl, // Save the Firebase Storage URL in the MongoDB document
        banner_name,
      });

      await newBanner.save();

      res.status(201).json({
        message: "Banner created successfully",
        banner: newBanner,
      });
    });

    // Write the file buffer to Firebase
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Server error" });
  }
};
