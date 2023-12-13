import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../css/Admindashboard.css';
import Fourbuttons from './Fourbuttons';

export default function Admindashboard() {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  

  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
    approved: false,
  });
  const addNewUser = (newUser) => {
    // Update the user list state with the new user
    setUserList([...userList, newUser]);
  };
  useEffect(() => {
    axios
      .get('http://localhost:5000/allusers')
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user list:', error);
      });
  }, []);

  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/delete-user/${userId}`)
          .then(() => {
            Swal.fire('User Deleted', 'The user has been deleted.', 'success');
            setUserList(userList.filter((user) => user._id !== userId));
          })
          .catch((error) => {
            console.error('Error deleting user:', error);
          });
      }
    });
  };

  const toggleUserApproval = (user) => {
    if (user) {
      // Toggle the approval status of the selected user
      const updatedUser = { ...user, approved: !user.approved };

      axios
        .patch(`http://localhost:5000/users/${user._id}`, updatedUser)
        .then((response) => {
          const updatedUser = response.data.user;
          const updatedUserList = userList.map((listUser) => {
            if (listUser._id === updatedUser._id) {
              return { ...updatedUser };
            }
            return listUser;
          });
          setUserList(updatedUserList);
          Swal.fire('User Updated', 'The user data has been updated.', 'success');
        })
        .catch((error) => {
          console.error('Error updating user:', error);
          Swal.fire('Error', 'An error occurred while updating the user.', 'error');
        });
    }
  };

  const openEditForm = (user) => {
    setIsEditFormOpen(true);
    setSelectedUser(user);
    setEditedUser({
      username: user.username,
      email: user.email,
      approved: user.approved,
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSave = () => {
    axios
      .patch(`http://localhost:5000/users/${selectedUser._id}`, editedUser)
      .then((response) => {
        const updatedUser = response.data.user;
        const updatedUserList = userList.map((listUser) => {
          if (listUser._id === updatedUser._id) {
            return { ...updatedUser };
          }
          return listUser;
        });
        setUserList(updatedUserList);
        setIsEditFormOpen(false);
        Swal.fire('User Updated', 'The user data has been updated.', 'success');
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        Swal.fire('Error', 'An error occurred while updating the user.', 'error');
      });
  };

  const handleCancel = () => {
    setIsEditFormOpen(false);
  };

 
  return (
    <div>
      <div id="admin">
        <h1 className="prohead">
          <b>Admin Dashboard</b>
        </h1>
        <br />
        <br />
      </div>

      <Fourbuttons addNewUser={addNewUser} />

      <table className="table caption-top bg-white rounded mt-5">
        <caption className="text-black fs-4 text-center mb-3">All Users</caption>

        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User ID</th>
            <th scope="col">User Name</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col ml-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <React.Fragment key={user._id}>
              <tr onClick={() => setSelectedUser(user)}>
                <th scope="row">{index + 1}</th>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>*************</td>
                <td>
                  {user.approved ? (
                    <>
                      <button className="btn btn-danger rounded-pill mr-3" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                      <button className="btn btn-primary rounded-pill" onClick={() => openEditForm(user)}>
                        Edit
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-success rounded-pill" onClick={() => toggleUserApproval(user)}>
                      Active
                    </button>
                  )}
                </td>
              </tr>
              {isEditFormOpen && selectedUser && selectedUser._id === user._id && (
                <tr>
                  <td colSpan="6">
                    <div className="edit-form border border-dark p-1 d-flex flex-column align-items-center">
                      <h2>Edit User</h2>
                      <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={editedUser.username}
                          onChange={handleEditFormChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={editedUser.email}
                          onChange={handleEditFormChange}
                          className="form-control"
                        />
                      </div>
                      <div className="form-group">
                        <label>Status:</label>
                        <select
                          name="approved"
                          value={editedUser.approved}
                          onChange={handleEditFormChange}
                          className="form-control"
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div>
                      <div className="buttons">
                        <button className="btn btn-danger rounded-pill mr-3" onClick={handleCancel}>
                          Cancel
                        </button>
                        <button className="btn btn-primary rounded-pill" onClick={handleSave}>
                          Save
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
