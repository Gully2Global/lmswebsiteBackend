const express = require('express');
const router = express.Router();
const timeSlotController = require('../controllers/timeSlotController'); // Import the controller
const authorizeRole = require("../middlewares/authorizeRole");
const authMiddleware = require("../middlewares/authMiddleware");
 
// Routes for managing time slots
 
// 1. Create a new time slot
// POST /api/timeslots
router.post('/create', 
    authMiddleware,
    authorizeRole("admin"),
    timeSlotController.createSlot);
 
// 2. Update a time slot by ID
// PUT /api/timeslots/:id
router.put('/update/:id',
    authMiddleware,
    authorizeRole("admin"),
    timeSlotController.updateSlot);
 
// 3. Delete a time slot by ID
// DELETE /api/timeslots/:id
router.delete('/delete/:id', 
    authMiddleware,
    authorizeRole("admin"),
    timeSlotController.deleteSlot);
 
// 4. Get a single time slot by ID
// GET /api/timeslots/:id
router.get('/gettimeslot/:id', timeSlotController.getSingleSlot);
 
// 5. Get all time slots
// GET /api/timeslots
router.get('/gettimeslots', timeSlotController.getAllSlots);
 
module.exports = router;
