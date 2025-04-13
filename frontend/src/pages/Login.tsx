import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import GradientBackground from "../components/GradientBackground";

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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Send the tokenResponse.access_token to your backend for verification / further login steps
      try {
        const res = await axios.post(`${backEndUrl}/auth/google/login`, {
          access_token: tokenResponse.access_token,
        });
        // Expected response: { token, userId, email, ... }
        const { token, userId, email } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
        navigate("/");
      } catch (error) {
        console.error("Google login error:", error);
        setErrorMessage(true);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      setErrorMessage(true);
    },
  });

  const responseGoogle = (response: any) => {
    console.log(response);
  };

  return (
    <div className="overflow-hidden">
      <GradientBackground />
    <div className="login">

      <section id="login-form">
      <h1 className="space-grotesk" style={{ zIndex: 100 }}>Capsule</h1>
      <p className="space-grotesk" style={{ zIndex: 100 }}>Capture. Collect. Relive.</p>

      <form onSubmit={handleSubmit} autoComplete="off">g
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
            <label htmlFor="email" className="placeholder" style={{ color: "hsla(0, 0%, 100%, 0.7)", marginLeft: "20px", marginTop: "5px"}}>
              Email or Phone Number
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
            <label htmlFor="password" className="placeholder" style={{ color: "hsla(0, 0%, 100%, 0.7)", marginLeft: "20px", marginTop: "5px"}}>
              Password
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
          <div className="flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <button
            type="button"
            onClick={() => googleLogin()}
            className="google-button"
          >
            Sign in with Google
          </button>
          <p id="signup-redirect">
            New to Time Capsule? <a href="./register">Sign Up Now.</a>
          </p>
        </form>
      </section>
     </div>
    </div>

  );
};

export default Login;
