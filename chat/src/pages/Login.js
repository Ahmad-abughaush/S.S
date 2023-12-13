import {React, useState } from "react";
import { auth } from "../Firebase";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state when submitting the form
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      // Sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Clear any previous error and loading state on success
      setErr(false);
      setLoading(false);
      // Redirect the user to a different route, e.g., home
      navigate("/");
    } catch (error) {
      // Handle authentication error
      console.error("Error signing in: ", error);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button disabled={loading}>Login</button>
          {/* Display error message if there's an error */}
          {err && <p className="error-message">Incorrect email or password</p>}
        </form>
        <p>
          Don't have an account? <Link to="/Signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
