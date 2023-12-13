// controllers/assignmentController.js
const Assignment = require('../models/assignmentmodel');

// Create a new assignment
const createAssignment = async (req, res) => {
  try {
    const { userId, subjectId } = req.body;
    const assignment = new Assignment({ userId, subjectId });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Could not create assignment' });
  }
};

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch assignments' });
  }
};

module.exports = {
    createAssignment,
    getAllAssignments
}