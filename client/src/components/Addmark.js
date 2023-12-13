import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


function AddMark() {
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isSubjectsModalVisible, setSubjectsModalVisible] = useState(false);
  const [isSubjectDetailsVisible, setSubjectDetailsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [obtainedMark, setObtainedMark] = useState('');

  useEffect(() => {
    // Fetch the list of users from your API when the component mounts
    axios.get('http://localhost:5000/allusers')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const toggleUserModal = () => {
    setUserModalVisible(!isUserModalVisible);
  };

  const toggleSubjectsModal = () => {
    setSubjectsModalVisible(!isSubjectsModalVisible);
  };

  const toggleSubjectDetails = () => {
    setSubjectDetailsVisible(!isSubjectDetailsVisible);
  };

  const selectUser = async (user) => {
    setSelectedUser(user);

    try {
      // Fetch subjects for the selected user based on their email
      const response = await axios.get(`http://localhost:5000/getSubjectsByUserEmail/${user.email}`);
      setSelectedUser({ ...user, subjects: response.data });
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }

    toggleSubjectsModal();
  };

  const selectSubject = (subject) => {
    setSelectedSubject(subject);
    setObtainedMark(subject.obtainedmark || ''); // Initialize the obtained mark
    toggleSubjectDetails();
  };


  const updateObtainedMark = async () => {
    try {
      // Send a PUT request to update the obtained mark
      const response = await axios.put(`http://localhost:5000/updateSubject/${selectedSubject._id}`, {
        obtainedMark: obtainedMark,
      });
  
      if (response.status === 200) {
        // Optionally, you can update the selected subject in your state with the updated data
        setSelectedSubject({ ...selectedSubject, obtainedmark: obtainedMark });
  
        // Display a success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Mark Added',
          text: `The mark ${obtainedMark} has been added successfully.`,
        });
      }
  
      // Close the subject details modal after saving
      toggleSubjectDetails();
    } catch (error) {
      console.error('Error updating obtained mark:', error);
  
      // Display an error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the mark. Please try again later.',
      });
    }
  };
  return (
    <div>
      <input
        className="btn btn-primary"
        type="button"
        value="Add Mark"
        style={{ marginLeft: '10px' }}
        onClick={toggleUserModal}
      />
      {isUserModalVisible && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-center">All Users</h5>
                <button type="button" className="close" data-dismiss="modal" onClick={toggleUserModal}>
                  <span className="text-white">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="list-group">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        selectUser(user);
                      }}
                    >
                      {user.username}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={toggleUserModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubjectsModalVisible && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          {/* Subjects modal content here */}
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-center">Subjects</h5>
                <button type="button" className="close" data-dismiss="modal" onClick={toggleSubjectsModal}>
                  <span className="text-white">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Add your subjects here */}
                <div className="list-group">
                  {selectedUser && selectedUser.subjects ? (
                    selectedUser.subjects.map((subject) => (
                      <button
                        key={subject._id}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          selectSubject(subject);
                        }}
                      >
                        {subject.subjectname}
                      </button>
                    ))
                  ) : (
                    <p>No subjects found for this user.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={toggleSubjectsModal}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSubjectDetailsVisible && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          {/* Subject details form content here */}
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title text-center">Subject Details</h5>
                <button type="button" className="close" data-dismiss="modal" onClick={toggleSubjectDetails}>
                  <span className="text-white">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Add your subject details form here */}
                <form>
                  <div className="form-group">
                    <label htmlFor="subjectName">Subject Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subjectName"
                      value={selectedSubject ? selectedSubject.subjectname : ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="minMark">Min Mark</label>
                    <input
                      type="text"
                      className="form-control"
                      id="minMark"
                      value={selectedSubject ? selectedSubject.minmark : ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="obtainedMark">Obtained Mark</label>
                    <input
                      type="text"
                      className="form-control"
                      id="obtainedMark"
                      value={obtainedMark}
                      onChange={(e) => setObtainedMark(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={toggleSubjectDetails}>
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={updateObtainedMark}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddMark;
