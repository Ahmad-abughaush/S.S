import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/Signup.css';

const WaitingHome = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();
  const [userApproved, setUserApproved] = useState(false);
  const email = decodedToken.email;
console.log(email)

  const checkUserApproval = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/email/${email}`);
      const userData = response.data;

      if (userData.approved) {
        setUserApproved(true);
        navigate('/');
      } else {
        setUserApproved(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkUserApproval();
    }, 5000);

    checkUserApproval();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <meta charSet="utf-8" />
      <title>Transparent Login Form UI</title>
      <div className="bg-img">
        <div className="content">
          <header>
            {userApproved ? (
              <p>User is approved! You can proceed.</p>
            ) : (
              <p>Waiting for  the user to be approved...</p>
            )}
          </header>
        </div>
      </div>
    </div>
  );
};

export default WaitingHome;
