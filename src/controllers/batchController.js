//src/controllers/batchController.js

const Batch = require("../models/batchModel");

exports.createBatch = async (req, res) => {
  try {
    const {
      batch_name,
      start_date,
      no_of_classes,
      teacher_id,
      students,
      contentMaterial,
      date,
    } = req.body;
    if (
      !batch_name ||
      !start_date ||
      !no_of_classes ||
      !teacher_id ||
      !students ||
      !contentMaterial ||
      !date
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newBatch = new Batch({
      batch_name,
      start_date,
      no_of_classes,
      teacher_id,
      students,
      contentMaterial,
      date,
    });
    await newBatch.save();
    res.status(201).json({ message: "Batch created successfully" });
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// src/controllers/batchController.js

exports.getAllBatches = async (req, res) => {
  try {
    const {
      start_date,
      end_date,
      teacher_id,
      students,
      sort_by,
      page = 1,
      limit = 10,
    } = req.query;

    // Build a query object
    let query = {};

    // Filter by date range
    if (start_date && end_date) {
      query.start_date = {
        $gte: new Date(start_date),
        $lte: new Date(end_date),
      };
    } else if (start_date) {
      query.start_date = { $gte: new Date(start_date) };
    } else if (end_date) {
      query.start_date = { $lte: new Date(end_date) };
    }

    // Filter by teacher_id
    if (teacher_id) {
      query.teacher_id = teacher_id;
    }

    // Filter by student_id
    if (students) {
      query.students = students;
    }

    // Build sort object
    let sort = {};
    if (sort_by === "newest") {
      sort.date = -1; // Sort by creation date descending
    } else if (sort_by === "oldest") {
      sort.date = 1; // Sort by creation date ascending
    } else if (sort_by === "start_date_asc") {
      sort.start_date = 1; // Sort by start_date ascending
    } else if (sort_by === "start_date_desc") {
      sort.start_date = -1; // Sort by start_date descending
    }

    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [
        { path: "teacher_id", select: "name email" },
        { path: "students", select: "name email" },
      ],
    };

    // Execute the query with pagination
    const batches = await Batch.paginate(query, options);

    res.status(200).json({
      message: "Batches fetched successfully",
      batches: batches.docs,
      totalPages: batches.totalPages,
      currentPage: batches.page,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBatchForStudent = async (req, res) => {
  try {
    const { students} = req.params;

    // Validate student_id
    if (!students) {
      return res.status(400).json({ error: "Student ID is required" });
    }
    const batches = await Batch.find({ students: students }).exec();

    res.status(200).json({
      message: "Batches fetched successfully",
      batches,
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get batches by authenticated teacher ID
exports.getBatchesByTeacherId = async (req, res) => {
  try {
    // Check if the user's role is 'teacher'
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: Not a teacher' });
    }

    const teacherId = req.user._id; // Use authenticated user's ID

    // Find batches where the teacher ID matches
    const batches = await Batch.find({ teacher_id: teacherId })
      .populate('students')   // Populate students details if needed
      .exec();

    // Check if any batches are found
    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: 'No batches found for this teacher' });
    }

    // Send the found batches as a response
    res.status(200).json(batches);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Server error', error });
  }
};