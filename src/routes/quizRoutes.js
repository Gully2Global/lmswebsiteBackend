// src/routes/quizRoutes.js

const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

// Create a quiz (Accessible to any authenticated user)
router.post('/create', authMiddleware,authorizeRole("teacher"), quizController.createQuiz);

// Get quizzes for a specific batch and class
router.get(
  '/batch/:batch_index/class/:class_level',
  authMiddleware,
  quizController.getQuizzes
);

// Get a specific quiz by ID
router.get('/:quiz_id', authMiddleware, quizController.getQuizById);

module.exports = router;
