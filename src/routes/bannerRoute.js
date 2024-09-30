const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  upload.single("banner_image"),
  authMiddleware,
  authorizeRole("admin"),
  bannerController.createBanner
);

module.exports = router;
