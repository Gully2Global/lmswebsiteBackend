const express = require("express");
const router = express.Router();
const payOut = require("../controllers/payoutController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post(
  "/createPayout",
  authMiddleware,
  authorizeRole("admin"),
  payOut.createPayout
);

router.get("/getPayouts", authMiddleware, payOut.getPayouts);

router.put(
  "/updatePayout/:id",
  authMiddleware,
  authorizeRole("admin"),
  payOut.updatePayout
);

router.delete(
  "/deletePayout/:id",
  authMiddleware,
  authorizeRole("admin"),
  payOut.deletePayout
);

module.exports = router;
