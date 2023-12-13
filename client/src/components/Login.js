import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsFillEnvelopeFill } from 'react-icons/bs';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      const { token, role, user_id } = response.data;
      let localStorageKey = 'token'; // Default key
  console.log(token)
      if (role === 'admin') {
        localStorageKey = 'admintoken'; // Use 'admintoken' key for admin
      }
  
      localStorage.setItem(localStorageKey, token);
      localStorage.setItem('user_id', user_id);
  
      if (role === 'admin') {
        navigate('/Admindashboard');
      } else {
        const approvalResponse = await axios.get('http://localhost:5000/check-approval', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const { approved } = approvalResponse.data;
  
        if (approved) {
          navigate('/');
        } else {
          alert ('Your account is pending approval by the admin.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Email or password is incorrect');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignIn();
  };

  useEffect(() => {
    // Check if the user is already logged in (based on stored token)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <meta charSet="utf-8" />
      <title>Transparent Login Form UI</title>
      <div className="bg-img">
        <div className="content">
         
              <header>Login</header>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <BsFillEnvelopeFill
                    style={{ width: '25px', height: '20px', marginTop: '13px' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="field space">
                  <RiLockPasswordFill
                    style={{ width: '25px', height: '20px', marginTop: '13px' }}
                  />
                  <input
                    type="password"
                    className="pass-key"
                    required
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <br />
                <div className="field">
                  <input type="submit" value="LOGIN" />
                </div>
                {error && <p className="error">{error}</p>}
              </form>
              <br />
              <div className="signup">
                Don't have an account?
                <Link to="/Signup">Signup Here</Link>
              </div>
        </div>
      </div>
    </div>
  );
}
