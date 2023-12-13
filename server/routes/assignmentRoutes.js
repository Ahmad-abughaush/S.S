const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignmentController');

// Create a new assignment
router.post('/assignments', assignmentController.createAssignment);

// Get all assignments
router.get('/assignments', assignmentController.getAllAssignments);

module.exports = router;