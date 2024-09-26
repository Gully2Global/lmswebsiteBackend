// src/controllers/userController.js
const User = require("../models/userModel");

exports.getProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    // Find user in MongoDB
    let user = await User.findOne({ auth_id: firebaseUid });

    if (!user) {
      user = new User({
        auth_id: firebaseUid,
        email: req.user.email || null,
        name: req.user.name || "New User",
        role: "student", 
        date_joined: new Date(),
      });
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
