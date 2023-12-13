import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillPersonFill } from 'react-icons/bs';
import { BsFillEnvelopeFill } from 'react-icons/bs';
import { RiLockPasswordFill } from 'react-icons/ri';
import axios from 'axios';
import '../css/Login.css';

export default function Signup() {
  const navigate = useNavigate();

  const initialFormData = {
    role: 'user',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const regexUsername = /^.{8,}$/; // At least 8 characters
  const regexEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/; // Email format with @ and .com
  const regexPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{8,})$/; // At least 8 characters with uppercase and special character

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!regexUsername.test(formData.username)) {
      alert('Username should be at least 8 characters.');
      return;
    }

    if (!regexEmail.test(formData.email)) {
      alert('Email should have a valid format.');
      return;
    }

    if (!regexPassword.test(formData.password)) {
      alert('Password should be at least 8 characters with an uppercase letter and a special character.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      if (formData.role === 'user') {
        navigate('/waitingHome');
      } else if (formData.role === 'admin') {
        navigate('/Admindashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      <title>Transparent Login Form UI</title>

      <div className="bg-img">
        <div className="content">
          <header>Sign up</header>

          <form onSubmit={handleSubmit}>
            <div className="field" style={{ marginBottom: '20px' }}>
              <BsFillPersonFill style={{ width: '30px', height: '25px', marginTop: '9px' }} />
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="field" style={{ marginBottom: '20px' }}>
              <BsFillEnvelopeFill style={{ width: '25px', height: '20px', marginTop: '13px' }} />
              <input
                type="email"
                required
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="field" style={{ marginBottom: '20px' }}>
              <RiLockPasswordFill style={{ width: '25px', height: '20px', marginTop: '13px' }} />
              <input
                type="password"
                className="pass-key"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="field" style={{ marginBottom: '20px' }}>
              <RiLockPasswordFill style={{ width: '25px', height: '20px', marginTop: '13px' }} />
              <input
                type="password"
                className="pass-key"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <input type="submit" value="SIGN UP" />
            </div>
          </form>

          <br />
          <div className="signup">
            Do you have an account? &nbsp;
            <div>
              <Link to="/login">Log in here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
