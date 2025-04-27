import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import GradientBackground from "../components/GradientBackground";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);

  const navigate = useNavigate();
  const backEndUrl: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleUsernameChange = (event: any): void => {
    setUserName(event.target.value);
  };

  const handleEmailChange = (e: any): void => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e: any): void => {
    setName(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handlePasswordChange = (e: any): void => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any): void => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      // setErrorMessage(true);
      return;
    }

    if (!isCheckboxChecked) {
      // setErrorMessage(true);
      alert("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      await axios.post(`${backEndUrl}/api/auth/register`, {
        username,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send("Server Error");

      setErrorMessage(true);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Send the access token to your backend endpoint
        const res = await axios.post(`${backEndUrl}/api/auth/google/register`, {
          access_token: tokenResponse.access_token,
        });
        // Optionally, you might want to log the user in immediately,
        // or redirect them to a login page
        navigate("/login");
      } catch (error) {
        console.error("Google signup error:", error);
        setErrorMessage(true);
      }
    },
    onError: (error) => {
      console.error("Google signup failed:", error);
      setErrorMessage(true);
    },
  });

  return (
    <div className="overflow-hidden font-poppins">
      <GradientBackground />

      <div className="login">
        <section id="login-form">
          <h1 style={{ zIndex: 100, fontSize: "30px" }}>Set up your account</h1>
          <p className="text-lg mb-2 z-50">
            Please complete all information to create your account on Capsule
          </p>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="input-group">
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder=" "
                autoComplete="off"
                onChange={handleUsernameChange}
              />
              <label
                htmlFor="name"
                className="placeholder"
                style={{
                  color: "hsla(0, 0%, 100%, 0.7)",
                  marginLeft: "20px",
                  marginTop: "5px",
                }}
              >
                Name
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
              <label
                htmlFor="email"
                className="placeholder"
                style={{
                  color: "hsla(0, 0%, 100%, 0.7)",
                  marginLeft: "20px",
                  marginTop: "5px",
                }}
              >
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
                style={{
                  color: "hsla(0, 0%, 100%, 0.7)",
                  marginLeft: "20px",
                  marginTop: "5px",
                }}
              >
                Password
              </label>
              <div
                className="absolute right-15 top-9/16 -translate-y-1/2 cursor-pointer p-1"
                aria-label="Toggle password visibility"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <svg
                  className="svg-eye"
                  width="18"
                  height="18"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.4331 15.9644C18.1407 14.7133 19.3784 12.9248 19.9474 10.8858C20.0175 10.6333 20.0175 10.3664 19.9474 10.1139C18.8417 6.13465 15.1928 3.21437 10.8617 3.21437C8.92047 3.21131 7.02605 3.81024 5.4394 4.92865M14.2903 17.1429C13.2274 17.5578 12.0711 17.7858 10.8617 17.7858C6.53011 17.7858 2.88083 14.8655 1.77597 10.8862C1.70578 10.6336 1.70578 10.3666 1.77597 10.1139C2.12971 8.84261 2.74709 7.65997 3.58797 6.64294"
                    stroke="#eae2e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.9224 13.5001C14.7089 12.6998 15.1489 11.6221 15.1473 10.5001C15.1473 8.13307 13.2286 6.21436 10.8616 6.21436C10.2915 6.21366 9.727 6.32706 9.2014 6.54787C8.6758 6.76868 8.1997 7.09244 7.80115 7.50007"
                    stroke="#eae2e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.86163 1.5L19.8616 19.5"
                    stroke="#eae2e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className="input-group relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password"
                id="password"
                required
                placeholder=" "
                autoComplete="new-password"
                onChange={handleConfirmPasswordChange}
                className="pr-10"
              />
              <label
                htmlFor="password"
                className="placeholder bold-button flex items-center justify-start gap-2"
                style={{
                  color: "hsla(0, 0%, 100%, 0.7)",
                  marginLeft: "20px",
                  marginTop: "5px",
                }}
              >
                Confirm password
              </label>
              <div
                className="absolute right-15 top-9/16 -translate-y-1/2 cursor-pointer p-1"
                aria-label="Toggle password visibility"
                onClick={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              >
                <svg
                  className="svg-eye"
                  width="18"
                  height="18"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.4331 15.9644C18.1407 14.7133 19.3784 12.9248 19.9474 10.8858C20.0175 10.6333 20.0175 10.3664 19.9474 10.1139C18.8417 6.13465 15.1928 3.21437 10.8617 3.21437C8.92047 3.21131 7.02605 3.81024 5.4394 4.92865M14.2903 17.1429C13.2274 17.5578 12.0711 17.7858 10.8617 17.7858C6.53011 17.7858 2.88083 14.8655 1.77597 10.8862C1.70578 10.6336 1.70578 10.3666 1.77597 10.1139C2.12971 8.84261 2.74709 7.65997 3.58797 6.64294"
                    stroke="#eae2e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.9224 13.5001C14.7089 12.6998 15.1489 11.6221 15.1473 10.5001C15.1473 8.13307 13.2286 6.21436 10.8616 6.21436C10.2915 6.21366 9.727 6.32706 9.2014 6.54787C8.6758 6.76868 8.1997 7.09244 7.80115 7.50007"
                    stroke="#eae2e2"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.86163 1.5L19.8616 19.5"
                    stroke="#eae2e2"
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
            <button
              type="submit"
              className="bold-button flex items-center justify-center"
              style={{ marginTop: "25px", marginBottom: "25px" }}
            >
              Create Account
            </button>
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-[1px] border-gray-200"></div>
              <span className="mx-4 text-white text-lg">or</span>
              <div className="flex-grow border-t border-[1px] border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={() => googleSignup()}
              className="google-button flex items-center justify-center gap-2"
            >
              Sign up with Google
            </button>
          </form>
          <p id="fineprint-agree">
            <input
              type="checkbox"
              id="agree"
              name="agree"
              required
              onChange={handleCheckboxChange}
              style={{
                marginRight: "8px",
                width: "16px", // Adjust the width
                height: "16px", // Adjust the height
                verticalAlign: "middle", // Align with text
                marginTop: "-2px", // Slightly move it up
              }}
            />
            Agree to the{" "}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Terms of Service
            </a>{" "}
            &{" "}
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Privacy Policy
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
