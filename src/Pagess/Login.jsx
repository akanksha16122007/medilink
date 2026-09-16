import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VALID_EMAILS = ["testing@gmail.com"];
const VALID_PASSWORD = "test11@@";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const savedSignup = JSON.parse(localStorage.getItem("signup") || "null");
    const isDemoLogin =
      VALID_EMAILS.includes(email) && password === VALID_PASSWORD;
    const isSignupLogin =
      savedSignup &&
      savedSignup.email === email &&
      savedSignup.pass === password;

    if (isDemoLogin || isSignupLogin) {
      const user = {
        name: savedSignup?.name,
        email: email,
        password: password,
        profilePic:
          "https://i.pinimg.com/736x/db/a9/ce/dba9ce433113b68e719456b6d78c4f2a.jpg",
      };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      return;
    }

    setError("Invalid email or password");
  };

  return (
    <div className="login-page">
      <div className="login-pic">
        <img src="/logins.png" alt="MediLink" />
      </div>
      <div className="login-box">
        <div className="login-image">
          <img src="/favicon.svg" />
        </div>

        <h2>Welcome Back!</h2>
        <p>Login to your account</p>
        <p className="login-tagline">
          Your health. Your records. Always accessible.
        </p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <div className="input-field">
            <i class="fa-regular fa-envelope"></i>
            <input
              type="email"
              className="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="password-field">
            <i class="fa-solid fa-unlock-keyhole"></i>
            <input
              type={showPassword ? "text" : "password"}
              className="pass"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <i class="fa-solid fa-eye"></i>
              ) : (
                <i class="fa fa-eye-slash" aria-hidden="true"></i>
              )}
            </button>
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login">
            Login
          </button>
        </form>
        <p className="signup-text">
          Don't have an account?<Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
