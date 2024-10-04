// src/controllers/teacherApplicationController.js

const TeacherApplication = require("../models/teacherApplicationModel");
const User = require("../models/userModel");
const Teacher = require("../models/teacherModel");

exports.createTeacherApplication = async (req, res) => {
  try {
    const userId = req.user.uid; // From auth middleware
    const { state, city, pincode, current_position, language } = req.body;

    // Validate required fields
    if (
      !req.file ||
      !state ||
      !city ||
      !pincode ||
      !current_position ||
      !language
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find the user in the User collection
    const user = await User.findOne({ auth_id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has already applied
    const existingApplication = await TeacherApplication.findOne({
      teacher_id: user._id,
    });
    if (existingApplication) {
      return res.status(400).json({ error: "Application already submitted" });
    }

    // Create a new TeacherApplication
    const teacherApplication = new TeacherApplication({
      teacher_id: user._id,
      resume_link: `/uploads/resumes/${req.file.filename}`, // Store the path to the resume
      state,
      city,
      pincode,
      current_position,
      language,
    });

    await teacherApplication.save();

    res.status(201).json({
      message: "Teacher application submitted successfully",
      application: teacherApplication,
    });
  } catch (error) {
    console.error("Error submitting teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTeacherApplications = async (req, res) => {
  try {
    const { approval_status } = req.query;
    const query = {};

    // Validate approval_status
    const validStatuses = ["pending", "approved", "rejected"];

    if (approval_status) {
      if (!validStatuses.includes(approval_status)) {
        return res.status(400).json({ error: "Invalid approval_status value" });
      }
      query.approval_status = approval_status;
    }

    const applications = await TeacherApplication.find(query)
      .populate({
        path: "teacher_id",
        select: "name email role",
      })
      .sort({ date_applied: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error fetching teacher applications:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.approveTeacherApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find the application
    const application = await TeacherApplication.findById(
      applicationId
    ).populate("teacher_id");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update application status
    application.approval_status = "approved";
    application.date_approved = new Date();
    await application.save();

    // Update user role to 'teacher'
    const user = await User.findById(application.teacher_id._id);
    user.role = "teacher";
    await user.save();

    // Check if a Teacher document already exists for this user
    const existingTeacher = await Teacher.findOne({ user_id: user._id });
    if (existingTeacher) {
      return res
        .status(400)
        .json({ error: "Teacher profile already exists for this user" });
    }

    // Create a new Teacher document
    const teacher = new Teacher({
      auth_id: user.auth_id,
      teacher_id: user.auth_id, // Assuming teacher_id is same as auth_id
      user_id: user._id,
      role: "teacher",
      qualifications: "", // Populate as needed
      bio: "", // Populate as needed
      approval_status: "approved",
      resume_link: application.resume_link,
      payout_info: "", // Populate as needed
      subject: null, // Populate as needed
      last_online: new Date(),
      experience: "", // Populate as needed
      no_of_classes: 0, // Initialize to 0
      available_time: "", // Populate as needed
      language: "", // Populate as needed
      is_grammar_teacher: false, // Default value
    });

    await teacher.save();

    res.status(200).json({
      message: "Application approved and teacher profile created successfully",
      application,
      teacher,
    });
  } catch (error) {
    console.error("Error approving teacher application:", error);
    res.status(500).json({ error: "Server error" });
  }
};
