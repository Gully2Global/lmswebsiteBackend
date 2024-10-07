const express = require("express");
const router = express.Router();
const batchController = require("../controllers/batchController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/",
  authMiddleware,
  authorizeRole("admin"),
  batchController.createBatch
);

module.exports = router;
