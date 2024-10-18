const mongoose = require('mongoose'); // Import mongoose
const Teacher = require('../models/teacherModel'); // Import teacher model

// Get Teacher by ID
exports.getTeacherById = async (req, res) => {
  const { id } = req.params;

  console.log(`Received request to get teacher with user_id: ${id}`);

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find the teacher by user_id and populate subject name
    const teacher = await Teacher.findOne({ user_id: id }).populate('subject', 'subject_name');

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    console.log(`Authenticated User Role: ${req.user.role}`);
    console.log(`Authenticated User ID: ${req.user._id}`);
    console.log(`Teacher's User ID: ${teacher.user_id}`);

    if (req.user.role === 'admin' || teacher.user_id.toString() === req.user._id.toString()) {
      return res.status(200).json({ teacher });
    } else {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
  } catch (error) {
    console.error(`Error fetching teacher by user_id (${id}):`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get All Teachers
exports.getAllTeachers = async (req, res) => {
  try {
    console.log('Authenticated user:', req.user);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }

    const teachers = await Teacher.find().populate('subject', 'subject_name');

    res.status(200).json({ teachers });
  } catch (error) {
    console.error('Error fetching all teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const Subject = require('../models/subjectModel');

// Update Teacher Details
exports.updateTeacherDetails = async (req, res) => {
    const { id } = req.params; // Extract teacher ID from params

    try {
        const { bio, language, available_time, subject_id } = req.body;

        // Validate and retrieve subject details if provided
        let subjectDetails = null;
        if (subject_id) {
            subjectDetails = await Subject.findById(subject_id);
            if (!subjectDetails) {
                return res.status(404).json({ error: 'Subject not found' });
            }
        }

        // Prepare the updates object
        const updates = {
            bio,
            language,
            available_time,
        };

        // If subject is valid, add it to the updates
        if (subjectDetails) {
            updates.subject = {
                id: subjectDetails._id,
                name: subjectDetails.subject_name,
            };
        }

        // Query the teacher by `user_id` and update
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { user_id: id }, // Query by `user_id`
            { $set: updates },
            { new: true, runValidators: true } // Return updated document
        );

        if (!updatedTeacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Fetch the updated teacher with subject details populated
        const teacherWithSubject = await Teacher.findOne({ user_id: id });

        res.status(200).json({
            message: 'Teacher details updated successfully',
            teacher: {
                ...teacherWithSubject.toObject(),
                subject: {
                    id: teacherWithSubject.subject.id,
                    name: teacherWithSubject.subject.name, // Correctly fetching subject name
                },
            },
        });
    } catch (error) {
        console.error('Error updating teacher details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
