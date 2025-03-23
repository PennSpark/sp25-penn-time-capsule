import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const navigate = useNavigate();
  const backEndUrl: string = import.meta.env.backend_url || "http://localhost:8080";

  const handlePasswordChange = (event: any): void => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event: any): void => {
    setEmail(event.target.value);
  };
  const handleUsernameChange = (event: any): void => {
    setUserName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = axios.post(`${backEndUrl}/register`, {username, email, password});
      navigate('/login');
    } catch(error) {
      console.error("Registration error:", error);
      setErrorMessage(true);
    }
  };

  return (
    <div
      className="login"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/filmBackground.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section id="login-form">
        <form onSubmit={handleSubmit} autoComplete="off">
          <h1>Register</h1>
          <div className="input-group">
            <input
              type="text"
              name="username"
              id="username"
              required
              placeholder=" "
              autoComplete="off"
              onChange={handleUsernameChange}
            />
            <label htmlFor="username" className="placeholder">
              Enter Username
            </label>
          </div>
          <div className="input-group">
            <input
              type="text"
              name="email"
              id="email"
              required
              placeholder=" "
              autoComplete="off"
              onChange={handleEmailChange}
            />
            <label htmlFor="email" className="placeholder">
              Enter your email
            </label>
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder=" "
              autoComplete="new-password"
              onChange={handlePasswordChange}
            />
            <label htmlFor="password" className="placeholder">
              Enter password
            </label>
          </div>
          {errorMessage && (
            <div className="error-message">
              <p>
                <i className="bx bxs-x-circle"></i> Invalid signup credentials
              </p>
            </div>
          )}
          <button type="submit" className="bold-button">
            Sign In
          </button>
          <p id="signup-redirect">
            Already have an account? <a href="./login">Log In Now.</a>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Register;
