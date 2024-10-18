// src/routes/teacherRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const { getTeacherById, getAllTeachers, updateTeacherDetails } = require('../controllers/teacherController');

// Import authentication middleware
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authentication middleware to all routes in this router
// router.use(authMiddleware);

/**
 * @route   GET /teachers/:id
 * @desc    Get a teacher by ID (accessible only by the teacher themselves)
 * @access  Private (Teacher only)
 */
router.get('/:id',authMiddleware, getTeacherById);

/**
 * @route   GET /teachers
 * @desc    Get all teachers (accessible only by admin users)
 * @access  Private (Admin only)
 */
router.get('/', authMiddleware,getAllTeachers);

router.put('/update/:id', authMiddleware, updateTeacherDetails);

module.exports = router;
