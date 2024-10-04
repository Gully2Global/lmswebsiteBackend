// src/controllers/responseController.js

const Response = require('../models/responseModel');
const Quiz = require('../models/quizModel');
const Student = require('../models/studentModel');
// Submit a quiz response (Accessible to any authenticated user)
exports.submitResponse = async (req, res) => {
    try {
        const { student_id, quiz_id, responses } = req.body;

        // Validate required fields
        if (
            !student_id ||
            !quiz_id ||
            !responses ||
            !Array.isArray(responses) ||
            responses.length === 0
        ) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the quiz exists
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Create a new response
        const newResponse = new Response({
            student_id,
            quiz_id,
            responses,
        });

        const savedResponse = await newResponse.save();

        res.status(201).json({
            message: 'Response submitted successfully',
            response: savedResponse,
        });
    } catch (error) {
        console.error('Error submitting response:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all responses for a quiz
exports.getResponsesByQuiz = async (req, res) => {
    try {
        const { quiz_id } = req.params;

        // Check if the quiz exists
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Fetch responses
        const responses = await Response.find({ quiz_id: quiz_id })
            //   .populate('student_id', 'name email')
            // .populate('student_id')
                .exec();

        res.status(200).json({
            message: 'Responses fetched successfully',
            responses,
        });
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
