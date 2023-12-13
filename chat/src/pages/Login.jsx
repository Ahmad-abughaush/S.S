import React from 'react';
import { Link } from 'react-router-dom';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsFillEnvelopeFill } from 'react-icons/bs';

export default function Login() {
  return (
    <div>
      <meta charSet="utf-8" />
      <title>Transparent Login Form UI</title>
      <div className="bg-img">
        <div className="content">
          <header>Login</header>
          <form>
            <div className="field">
              <BsFillEnvelopeFill
                style={{ width: '25px', height: '20px', marginTop: '13px' }}
              />
              <input
                type="text"
                required
                placeholder="Email"
                name="email"
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
              />
            </div>
            <br />
            <div className="field">
              <input type="submit" value="LOGIN" />
            </div>
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
