// src/middlewares/ensureUserExists.js
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const firebaseUid = req.user.uid;

    let user = await User.findOne({ auth_id: firebaseUid });

    if (!user) {
      // Create a new user document
      user = new User({
        auth_id: firebaseUid,
        email: req.user.email || null,
        name: req.user.name || "New User",
        role: "student", // Default role; adjust as needed
        date_joined: new Date(),
      });
      await user.save();
    }

    req.userModel = user; // Attach the user document to the request
    next();
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    res.status(500).json({ error: "Server error" });
  }
};
