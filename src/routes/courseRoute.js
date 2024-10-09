const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authorizeRole = require("../middlewares/authorizeRole");
const authMiddleware = require("../middlewares/authMiddleware");

// Routes for course management
router.get('/allcourses', courseController.getAllCourses); // GET all courses
router.post('/createcourse',
    authMiddleware,
    authorizeRole("admin"),
    courseController.createCourse); // POST create a new course
router.get('/courses/:id', courseController.getCourseById); // GET a specific course by ID
router.put('/updatecourse/:id',
    authMiddleware,
    authorizeRole("admin"),
    courseController.updateCourse); // PUT update a specific course by ID
router.delete('/deletecourse/:id',
    authMiddleware,
    authorizeRole("admin"),
    courseController.deleteCourse); // DELETE a specific course by ID

module.exports = router;   