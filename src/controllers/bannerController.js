// src/controllers/bannerController.js

const { bucket } = require("../services/firebaseService"); // Import Firebase bucket
const Banner = require("../models/bannerModel");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // To generate unique filenames for Firebase Storage

// Create Banner
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

// Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { banner_id } = req.params;
    const { banner_name } = req.body;

    // Find the banner by ID
    const banner = await Banner.findById(banner_id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // If a new file is uploaded, replace the old image
    let publicUrl = banner.banner_image; // Initialize with the existing image URL

    if (req.file) {
      // Generate a unique filename for the new image
      const newFileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      const newFile = bucket.file(newFileName);

      // Upload the new file to Firebase Storage
      const newBlobStream = newFile.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });

      newBlobStream.on("error", (error) => {
        console.error("Error uploading file to Firebase:", error);
        return res.status(500).json({ error: "File upload error" });
      });

      newBlobStream.on("finish", async () => {
        publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(newFileName)}?alt=media`;

        // Delete the old file from Firebase Storage
        const oldFileName = decodeURIComponent(
          banner.banner_image.split("/o/")[1].split("?")[0]
        );
        const oldFile = bucket.file(oldFileName);
        oldFile.delete().catch((err) => {
          console.error("Error deleting old file from Firebase:", err);
        });

        // Update the banner document in MongoDB
        const updatedBanner = await Banner.findByIdAndUpdate(
          banner_id,
          {
            banner_name: banner_name || banner.banner_name,
            banner_image: publicUrl,
          },
          { new: true }
        );

        return res.status(200).json({
          message: "Banner updated successfully",
          banner: updatedBanner,
        });
      });

      newBlobStream.end(req.file.buffer); // Write the new file buffer
    } else {
      // Update only the banner name if no new image is uploaded
      const updatedBanner = await Banner.findByIdAndUpdate(
        banner_id,
        {
          banner_name: banner_name || banner.banner_name,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Banner updated successfully",
        banner: updatedBanner,
      });
    }
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { banner_id } = req.params;
    const banner = await Banner.findById(banner_id);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    const publicUrl = banner.banner_image;
    const oldFileName = decodeURIComponent(
      banner.banner_image.split("/o/")[1].split("?")[0]
    );
    const oldFile = bucket.file(oldFileName);
    oldFile.delete().catch((err) => {
      console.error("Error deleting old file from Firebase:", err);
    });
    const deletedBanner = await Banner.findByIdAndDelete(banner_id);
    return res.status(200).json({
      message: "Banner deleted successfully",
      banner: deletedBanner,
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ error: "Server error" });
  }
};
