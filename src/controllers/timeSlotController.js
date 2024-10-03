const TimeSlot = require('../models/timeSlotModel'); // Import the TimeSlot model

// Controller to handle time slots
const timeSlotController = {};

// 1. Create a time slot
timeSlotController.createSlot = async (req, res) => {
    try {
        const { start, end } = req.body.time_slot;

        // Ensure both start and end times are provided
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end times are required' });
        }

        // Create a new time slot
        const newTimeSlot = new TimeSlot({
            time_slot: {
                start,
                end
            }
        });

        await newTimeSlot.save();
        res.status(201).json({ message: 'Time slot created successfully', timeSlot: newTimeSlot });
    } catch (error) {
        console.error('Error creating time slot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 2. Update a time slot
timeSlotController.updateSlot = async (req, res) => {
    try {
        // Use $set to update nested fields
        const updatedSlot = await TimeSlot.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    'time_slot.start': req.body.time_slot.start,
                    'time_slot.end': req.body.time_slot.end,
                    'approval_status': req.body.approval_status
                }
            },
            { new: true }
        );

        if (!updatedSlot) return res.status(404).json({ message: 'Time slot not found' });

        res.status(200).json({ message: 'Time slot updated successfully', timeSlot: updatedSlot });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// 3. Delete a time slot
timeSlotController.deleteSlot = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSlot = await TimeSlot.findByIdAndDelete(id);
        if (!deletedSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }

        res.status(200).json({ message: 'Time slot deleted successfully' });
    } catch (error) {
        console.error('Error deleting time slot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// 4. Get a single time slot by ID
timeSlotController.getSingleSlot = async (req, res) => {
    const { id } = req.params;

    try {
        const timeSlot = await TimeSlot.findById(id);
        if (!timeSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }

        res.status(200).json(timeSlot);
    } catch (error) {
        console.error('Error retrieving time slot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


timeSlotController.getAllSlots = async (req, res) => {
    try {
        const { startDate, endDate, approvalStatus } = req.query;
       
        // Create a filter object
        const filter = {};

         // Filter by approval_status if provided
         if (approvalStatus) {
            filter['approval_status'] = approvalStatus;
        }
        if (startDate || endDate) {
            filter['time_slot.start'] = {};
            if (startDate) filter['time_slot.start'].$gte = new Date(startDate);
            if (endDate) filter['time_slot.end'] = { $lte: new Date(endDate) };
        }

        // Fetch all time slots with the applied filters
        const timeSlots = await TimeSlot.find(filter).sort({ 'time_slot.start': -1 });

        res.status(200).json({ message: "TimeSlots fetched successfully", timeSlots });
    } catch (error) {
        console.error('Error retrieving time slots:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = timeSlotController;