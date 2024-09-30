// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const classRoutes = require("./src/routes/classRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");
const bannerRoutes = require("./src/routes/bannerRoute");
const courseRoutes = require("./src/routes/courseRoute");

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
