import React from "react";
const Login = () => {
  return (
    <div>
      <h2>Welcome Back!</h2>
      <p>Login to your account</p>
      <form>
        <label>Email</label>
        <input type="email" className="email" placeholder="Enter your email" />
        <label>Password</label>
        <input
          type="password"
          className="pass"
          placeholder="Enter your password"
        />
        <button className="login">Login</button>
      </form>
      <p>
        Don't have an account?<a href="/signup">Sign up</a>
      </p>
    </div>
  );
};
export default Login;
