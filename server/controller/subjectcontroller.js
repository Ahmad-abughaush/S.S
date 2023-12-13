// Import the Subject model
const Subject = require('../models/subjectmodel'); 

// Example usage in your controller
const createSubject = async (req, res) => {
  try {
    const subjectData = req.body;
    const subject = new Subject(subjectData);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllSubjects = async (req, res) => {
    try {
      const subjects = await Subject.find();
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Error fetching subjects', error: error.message });
    }
  };



  const getSubjectBySubjectId = async (req, res) => {
    try {
      const subjectId = req.params.subject_id;
      const subject = await Subject.findById(subjectId);
  
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Ensure that subject data includes subjectname and minmark
      const { subjectname, minmark } = subject;
  
      res.json({ subjectname, minmark });
    } catch (error) {
      console.error('Error fetching subject by subject ID:', error);
      res.status(500).json({ message: 'Error fetching subject by subject ID', error: error.message });
    }
  };


  const getSubjectsByUserEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const subjects = await Subject.find({ email });
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects by email:', error);
      res.status(500).json({ message: 'Error fetching subjects by email', error: error.message });
    }
  };


// add mark
  const updateSubject = async (req, res) => {
    try {
      const { subjectId } = req.params;
      const { obtainedMark } = req.body;
  
      const updatedSubject = await Subject.findByIdAndUpdate(
        subjectId,
        { obtainedmark: obtainedMark },
      );
  
      if (!updatedSubject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      res.status(200).json(updatedSubject);
    } catch (error) {
      console.error('Error updating obtained mark:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  // add mark

// home
  const getSubjectsByUserId = async (req, res) => {
    try {
      const userId = req.params.userId; // Assuming you have the user's ID
      const subjects = await Subject.find({ user: userId, obtainedMark: { $exists: true, $ne: null } });
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects by user ID:', error);
      res.status(500).json({ message: 'Error fetching subjects by user ID', error: error.message });
    }
  };
  // home

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectsByUserEmail,
    updateSubject,
    getSubjectsByUserId,
    getSubjectBySubjectId
};
