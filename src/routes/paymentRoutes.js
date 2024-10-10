const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

router.post("/", authMiddleware, paymentController.createPayment);

router.delete(
  "/delete/:id",
  authMiddleware,
  authorizeRole("admin"),
  paymentController.deletePayment
);

router.get(
  "/",
    authMiddleware,
    authorizeRole("admin"),
  paymentController.getAllPayments
);

router.get(
  "/details/:payment_id",
  //   authMiddleware,
  //   authorizeRole("student"),
  paymentController.getPaymentDetails
);
module.exports = router;
