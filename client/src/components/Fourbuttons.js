import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import AssignSubjectsToUsers from './Assignstou'
import Addmark from './Addmark'
import { Link, useNavigate } from 'react-router-dom';


function Fourbuttons({ addNewUser }) {
  const navigate = useNavigate();
  const [isNewUserFormOpen, setIsNewUserFormOpen] = useState(false);
  const [isNewSubjectFormOpen, setIsNewSubjectFormOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [newSubject, setNewSubject] = useState({
    subjectname: '',
    minmark: '',
  });

  const openNewUserForm = () => {
    setIsNewUserFormOpen(true);
  };

  const openNewSubjectForm = () => {
    setIsNewSubjectFormOpen(true);
  };

  const handleNewUserChange = (event) => {
    const { name, value } = event.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleNewSubjectChange = (event) => {
    const { name, value } = event.target;
    setNewSubject({
      ...newSubject,
      [name]: value,
    });
  };
  const handleNewUserSubmit = () => {
    axios
      .post('http://localhost:5000/createuser', newUser)
      .then((response) => {
        const { data } = response; // Destructure the response to get the data
  
        if (response.status === 201) {
          // Display a success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message,
          });
  
          // Optionally, you can redirect the user or perform other actions here.
        } else {
          // Display an error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
        }
  
        setIsNewUserFormOpen(false); // Close the user registration form
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        // Display a generic error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while adding the user.',
        });
      });
  };
  

  const handleNewSubjectSubmit = () => {
    axios
      .post('http://localhost:5000/createsubject', newSubject)
      .then((response) => {
        setIsNewSubjectFormOpen(false);
        setNewSubject({
          subjectname: '',
          minmark: '',
        });
        // Display a success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Subject added successfully!',
        });
      })
      .catch((error) => {
        console.error('Error creating subject:', error);
        // Display an error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while adding the subject.',
        });
      });
  };
  const handleLogout = () => {
    // Perform your logout logic here, e.g., clearing user data from local storage or making an API request.
    // Then navigate to the LoginPage.
    localStorage.removeItem('token'); // Clear the token or user data from localStorage.
    navigate('/login'); // Navigate to the LoginPage.
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" type="button" onClick={openNewUserForm}>
          Add User
        </button>
        <button className="btn btn-primary" type="button" onClick={openNewSubjectForm} style={{ marginLeft: '10px' }}>
          Add Subject
        </button>
        <AssignSubjectsToUsers/>
        <Addmark/>
        <button
        className="btn btn-dark " // Apply the Bootstrap classes for a dark button
        type="button"
        onClick={handleLogout}
        style={{ marginLeft: '10px' }}
      >
        Logout
      </button>
      </div>

      {/* New User Form */}
      {isNewUserFormOpen && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-center">Add User</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => setIsNewUserFormOpen(false)}
                >
                  <span className="text-white">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="new-username">Username:</label>
                    <input
                      type="text"
                      id="new-username"
                      name="username"
                      value={newUser.username}
                      onChange={handleNewUserChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-email">Email:</label>
                    <input
                      type="text"
                      id="new-email"
                      name="email"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-password">Password:</label>
                    <input
                      type="password"
                      id="new-password"
                      name="password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                      className="form-control"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() => setIsNewUserFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNewUserSubmit}>
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Subject Form */}
      {isNewSubjectFormOpen && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-center">Add Subject</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => setIsNewSubjectFormOpen(false)}
                >
                  <span className="text-white">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="new-subjectname">Subject Name:</label>
                    <input
                      type="text"
                      id="new-subjectname"
                      name="subjectname"
                      value={newSubject.subjectname}
                      onChange={handleNewSubjectChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="new-minmark">Minimum Mark:</label>
                    <input
                      type="number"
                      id="new-minmark"
                      name="minmark"
                      value={newSubject.minmark}
                      onChange={handleNewSubjectChange}
                      className="form-control"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                  onClick={() => setIsNewSubjectFormOpen(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleNewSubjectSubmit}>
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fourbuttons;
