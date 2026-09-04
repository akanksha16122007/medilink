import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VALID_EMAILS = ["testing@gmail.com"];
const VALID_PASSWORD = "12345678";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (VALID_EMAILS.includes(email) && password === VALID_PASSWORD) {
      // const user = {
      //   name: "Ananya Malhotra",
      //   email: email,
      //   password: password,
      //   profilePic:
      //     "https://i.pinimg.com/736x/db/a9/ce/dba9ce433113b68e719456b6d78c4f2a.jpg",
      // };
      // localStorage.setItem("user", JSON.stringify(user));
      navigate("/profile");
      return;
    }

    setError("Invalid email or password");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p>Login to your account</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            className="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            className="pass"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
