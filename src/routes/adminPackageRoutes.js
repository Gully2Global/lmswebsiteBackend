const express = require("express");
const router = express.Router();
const adminPackageController = require("../controllers/packagesController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/createPackage",
  authMiddleware,
  upload.single("image"),
  authorizeRole("admin"),
  adminPackageController.createPackage
);

router.get(
  "/getPackages/:class_id",
  authMiddleware,
  adminPackageController.getPackagesByClass
);

router.get(
  "/getAllPackages",
  authMiddleware,
  authorizeRole("admin"),
  adminPackageController.getAllPackages
);

module.exports = router;
