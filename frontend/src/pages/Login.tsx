import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import GradientBackground from "../components/GradientBackground";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
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
              <label htmlFor="email" className="placeholder" style={{ color: "hsla(0, 0%, 100%, 0.7)", marginLeft: "20px", marginTop: "5px" }}>
                Email or Phone Number
              </label>
            </div>
            <div className="input-group relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                placeholder=" "
                autoComplete="new-password"
                onChange={handlePasswordChange}
                className="pr-10"
              />
              <label
                htmlFor="password"
                className="placeholder bold-button flex items-center justify-start gap-2"
                style={{ color: "hsla(0, 0%, 100%, 0.7)", marginLeft: "20px", marginTop: "5px" }}
              >
                Password

              </label>
              <div className="absolute right-15 top-9/16 -translate-y-1/2 cursor-pointer p-1"
                aria-label="Toggle password visibility"
                onClick={() => { setShowPassword(!showPassword) }}
              >
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4331 15.9644C18.1407 14.7133 19.3784 12.9248 19.9474 10.8858C20.0175 10.6333 20.0175 10.3664 19.9474 10.1139C18.8417 6.13465 15.1928 3.21437 10.8617 3.21437C8.92047 3.21131 7.02605 3.81024 5.4394 4.92865M14.2903 17.1429C13.2274 17.5578 12.0711 17.7858 10.8617 17.7858C6.53011 17.7858 2.88083 14.8655 1.77597 10.8862C1.70578 10.6336 1.70578 10.3666 1.77597 10.1139C2.12971 8.84261 2.74709 7.65997 3.58797 6.64294"
                    stroke="#E6D3DC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M13.9224 13.5001C14.7089 12.6998 15.1489 11.6221 15.1473 10.5001C15.1473 8.13307 13.2286 6.21436 10.8616 6.21436C10.2915 6.21366 9.727 6.32706 9.2014 6.54787C8.6758 6.76868 8.1997 7.09244 7.80115 7.50007"
                    stroke="#E6D3DC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M1.86163 1.5L19.8616 19.5"
                    stroke="#E6D3DC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

            </div>
            {errorMessage && (
              <div className="error-message">
                <p>
                  <i className="bx bxs-x-circle"></i> Invalid login credentials
                </p>
              </div>
            )}
          <p className="space-grotesk forgot-pwd" style={{ zIndex: 100, position: "relative", marginRight: "0px" }}>Forgot Password?</p>
            <button type="submit" className="bold-button flex items-center justify-center gap-2">
              Log in
              <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.203 5.9001C12.175 4.7561 12.135 3.8481 12.099 3.1641C12.043 2.1641 11.327 1.3561 10.327 1.2601C9.46697 1.1761 8.25497 1.1001 6.64297 1.1001C5.03097 1.1001 3.81897 1.1761 2.95897 1.2601C1.95897 1.3601 1.24297 2.1641 1.18697 3.1641C1.11497 4.4521 1.04297 6.5241 1.04297 9.5001C1.04297 12.4761 1.11897 14.5481 1.19097 15.8361C1.24697 16.8361 1.96297 17.6441 2.95897 17.7401C3.81897 17.8241 5.03097 17.9001 6.64297 17.9001C8.25497 17.9001 9.46697 17.8241 10.327 17.7401C11.323 17.6401 12.043 16.8361 12.095 15.8361C12.131 15.1521 12.171 14.2441 12.199 13.1001" stroke="#E6D3DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.455 5.44676C16.011 5.07076 15.411 5.35076 15.371 5.93476C15.339 6.45076 15.299 7.09076 15.275 7.78276L7.47503 8.06676C6.97503 8.08676 6.53503 8.41476 6.47903 8.91076C6.45903 9.08676 6.44303 9.28676 6.44303 9.49876C6.44303 9.71076 6.45903 9.90676 6.47903 10.0868C6.53903 10.5828 6.97503 10.9148 7.47503 10.9308L15.275 11.2148C15.299 11.8308 15.331 12.4468 15.371 13.0628C15.411 13.6428 16.011 13.9228 16.455 13.5508C16.847 13.2188 17.359 12.7588 18.011 12.1188C19.079 11.0708 19.599 10.3388 19.843 9.91876C19.995 9.66276 19.995 9.33876 19.843 9.08276C19.599 8.66276 19.079 7.93076 18.011 6.88276C17.363 6.24676 16.847 5.78276 16.455 5.45076L16.455 5.44676Z" stroke="#E6D3DC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

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
