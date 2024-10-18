// src/app.js
const express = require("express");
const cors = require("cors");
const packageRoutes = require("./src/routes/adminPackageRoutes");
const helmet = require("helmet");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const classRoutes = require("./src/routes/classRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const bannerRoutes = require("./src/routes/bannerRoute");
const courseRoutes = require("./src/routes/courseRoute");
const customerQueryRoutes = require("./src/routes/customerQueriesRoutes");
const zoomRoutes = require("./src/routes/zoomRoutes");
const timeSlotRoutes = require("./src/routes/timeSlotRoutes");
const quizRoutes = require("./src/routes/quizRoutes");
const responseRoutes = require("./src/routes/responseRoutes");
const createBatchRoutes = require("./src/routes/batchRoutes");
const circularNotificationRoutes = require("./src/routes/circularNotificationRoutes");
const meetingRoutes = require("./src/routes/meetingRoutes");
const payoutRoutes = require("./src/routes/payoutRoutes");
const createCustomPackageRoutes = require("./src/routes/createCustomPackageRoutes");
const teacherRoutes = require("./src/routes/teacherRoutes");

const paymentRoutes = require("./src/routes/paymentRoutes");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Routes
app.use("/auth", authRoutes);
const teacherApplicationRoutes = require("./src/routes/teacherApplicationRoutes");

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.use("/teacher-application", teacherApplicationRoutes);
app.use("/classes", classRoutes);
app.use("/subjects", subjectRoutes);
app.use("/banners", bannerRoutes);
app.use("/courses", courseRoutes);
app.use("/queries", customerQueryRoutes);

app.use("/timeSlots", timeSlotRoutes);
app.use("/quizzes", quizRoutes);
app.use("/responses", responseRoutes);

app.use("/customPackages", createCustomPackageRoutes);

app.use("/batches", createBatchRoutes);
app.use("/circularNotifications", circularNotificationRoutes);
app.use("/zoom", zoomRoutes);
app.use("/meetings", meetingRoutes);
app.use("/payouts", payoutRoutes);
app.use("/packages", packageRoutes);
app.use("/payment", paymentRoutes);
app.use("/teachers", teacherRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
