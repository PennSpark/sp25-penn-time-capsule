import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const navigate = useNavigate();
  const backEndUrl: string = import.meta.env.backend_url || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleEmailChange = (e: any): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: any): void => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backEndUrl}/login`, { email, password });
      const { token, userId } = response.data;
      if (token && userId) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
        navigate("/");
      } else {
        setErrorMessage(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(true);
    }
  };

  const responseGoogle = (response: any) => {
    console.log(response);
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
          <h1>Sign In</h1>
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
                <i className="bx bxs-x-circle"></i> Invalid login credentials
              </p>
            </div>
          )}
          <button type="submit" className="bold-button">
            Sign In
          </button>
          <p id="signup-redirect">
            New to Time Capsule? <a href="./register">Sign Up Now.</a>
          </p>
        </form>
      </section>
    </div>
  );
};

export default Login;
