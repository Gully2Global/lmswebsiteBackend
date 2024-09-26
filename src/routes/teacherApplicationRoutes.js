// src/routes/teacherApplicationRoutes.js

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // Import upload middleware
const teacherApplicationController = require("../controllers/teacherApplicationController");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/apply",
  authMiddleware,
  upload.single("resume"), // Apply upload middleware here
  [
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("pincode").isNumeric().withMessage("Pincode must be a number"),
    body("language").notEmpty().withMessage("Language is required"),
    body("current_position")
      .notEmpty()
      .withMessage("Current position is required"),
  ],
  teacherApplicationController.createTeacherApplication
);
router.get(
  "/",
  authMiddleware,
  authorizeRole("admin"), // Only admins can access this endpoint
  teacherApplicationController.getTeacherApplications
);

router.put(
  "/approve/:applicationId",
  authMiddleware,
  authorizeRole("admin"),
  teacherApplicationController.approveTeacherApplication
);

module.exports = router;
