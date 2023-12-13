const express = require("express");
const router = express.Router();
const subjectController = require('../controller/subjectcontroller');

// Endpoint to create a new subject
router.post('/createsubject', subjectController.createSubject);

// assignstos
router.get('/allsubjects', subjectController.getAllSubjects);
router.get('/getSubjectbysubjectid/:subject_id', subjectController.getSubjectBySubjectId);
// assignstos

router.get('/getSubjectsByUserEmail/:email', subjectController.getSubjectsByUserEmail);

router.put('/updateSubject/:subjectId', subjectController.updateSubject);
module.exports = router;
