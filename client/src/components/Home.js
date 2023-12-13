import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import '../css/Home.css';

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  const [userSubjects, setUserSubjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const email = decodedToken.email;

    // Fetch user data by email
    axios
      .get(`http://localhost:5000/userbyemail/${email}`)
      .then((response) => {
        const { username, email } = response.data;
        setUserData({ username, email });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

    // Fetch subjects by user email
    axios
      .get(`http://localhost:5000/getSubjectsByUserEmail/${email}`)
      .then((response) => {
        setUserSubjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user subjects:', error);
      });
  }, []);

  // Filter subjects that have a non-empty obtained mark
  const filteredUserSubjects = userSubjects.filter((subject) => subject.obtainedmark && subject.obtainedmark.trim() !== '');

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');

    // Navigate to the login page
    navigate('/Login');
  };

  return (
    <div id="Home">
      <div className="background-image"></div>
      <div className="content">
        <h1>Welcome</h1>

        {/* First Card: Student Details */}
        <div className="card mt-3">
          <h2>Student Details</h2>
          <table className="details">
            <tbody>
              <tr>
                <td className="label">Name:</td>
                <td className="value">{userData.username}</td>
              </tr>
              <tr>
                <td className="label">Email:</td>
                <td className="value">{userData.email}</td>
              </tr>
              {/* Add more rows for additional details as needed */}
            </tbody>
          </table>
        </div>

        {/* Second Card: Student Subjects */}
        <div className="card mt-3">
          <h2>Student Subjects</h2>
          <table className="subjects">
            <thead>
              <tr>
                <th>Subject Name</th>
                <th>Pass Mark</th>
                <th>Obtained Mark</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserSubjects.map((subject) => (
                <tr key={subject._id}>
                  <td className="value">{subject.subjectname}</td>
                  <td className="value">{subject.minmark}</td>
                  <td className="value">{subject.obtainedmark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logout Button */}
        <div className="mt-3">
        <button
  onClick={handleLogout}
  className="btn btn-dark rounded-pill"
>
  Logout
</button>        </div>
      </div>
    </div>
  );
};

export default Home;
