import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AssignSubjectsToUsers() {
  const [showListModal, setShowListModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [minMark, setMinMark] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [uniqueSubjectNames, setUniqueSubjectNames] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleListModalClose = () => setShowListModal(false);
  const handleListModalShow = () => setShowListModal(true);

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);

    try {
      const response = await axios.get(`http://localhost:5000/oneuser/${userId}`);
      const selectedUser = response.data;

      if (selectedUser) {
        setSelectedUserEmail(selectedUser.email);
      } else {
        alert('User not found or email is empty');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('An error occurred while fetching user data');
    }
  };

  const handleSubjectSelect = async (subject) => {
    setSelectedSubject(subject);

    try {
      // Call the API to fetch filtered users for the selected subject
      const response = await axios.get('http://localhost:5000/filteredusers', {
        params: { selectedSubject: subject },
      });
      setFilteredUsers(response.data);

      // Find the subject details and set them
      const selectedSubjectDetail = subjects.find(
        (subj) => subj.subjectname === subject
      );
      if (selectedSubjectDetail) {
        setMinMark(selectedSubjectDetail.minmark);
        setSubjectName(selectedSubjectDetail.subjectname);
      } else {
        setMinMark('');
        setSubjectName('');
      }
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  };

  const handleAddSubjectToUser = async () => {
    try {
      if (!selectedUser || !selectedSubject) {
        // Handle validation, e.g., show an error message
        return;
      }

      // Create a new subject object with subject name, min mark, and email
      const newSubject = {
        subjectname: subjectName,
        minmark: minMark,
        email: selectedUserEmail,
      };

      // Make a POST request to create the new subject
      await axios.post('http://localhost:5000/createsubject', newSubject);

      // Make a PUT request to update the user's subjects (if needed)
      await axios.put('http://localhost:5000/updateusersubject', {
        userId: selectedUser,
        newSubjectName: selectedSubject,
      });

      // Handle success (e.g., show a confirmation message)
      Swal.fire(
        'Subject Added!',
        'The subject has been added to the user.',
        'success'
      );

      // Close the modal and reset selections
      handleListModalClose();
      setSelectedUser('');
      setSelectedUserEmail('');
      setSelectedSubject('');
      setMinMark('');
      setSubjectName('');
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error adding subject to user:', error);
      Swal.fire(
        'Error',
        'An error occurred while adding the subject to the user.',
        'error'
      );
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/allsubjects');
      setSubjects(response.data);

      // Extract unique subject names
      const uniqueNames = [
        ...new Set(response.data.map((subject) => subject.subjectname)),
      ];
      setUniqueSubjectNames(uniqueNames);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchFilteredUsers = async () => {
    try {
      // Call the API to fetch filtered users for the initially selected subject
      const response = await axios.get('http://localhost:5000/filteredusers', {
        params: { selectedSubject: selectedSubject },
      });
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    }
  };

  useEffect(() => {
    // Fetch subjects when the component mounts
    fetchSubjects();
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    // Fetch filtered users when the selected subject changes
    fetchFilteredUsers();
  }, [selectedSubject]); // Dependency on selectedSubject to refetch when subject changes

  return (
    <div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={handleListModalShow}
        style={{ marginLeft: '10px' }}
      >
        Assign Subject to User
      </button>

      <Modal show={showListModal} onHide={handleListModalClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Assign Subject to User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          
            <Form.Group>
              <Form.Label>Select a Subject</Form.Label>
              <Form.Control
                as="select"
                value={selectedSubject}
                onChange={(e) => handleSubjectSelect(e.target.value)}
                className="form-control"
              >
                <option value="">Choose a subject...</option>
                {uniqueSubjectNames.map((subjectName) => (
                  <option key={subjectName} value={subjectName}>
                    {subjectName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Select a User</Form.Label>
              <Form.Control
                as="select"
                value={selectedUser}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="form-control"
              >
                <option value="">Choose a user...</option>
                {filteredUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleListModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSubjectToUser}>
            Add Subject to User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AssignSubjectsToUsers;
