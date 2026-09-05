import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [signup, setSignup] = useState({
    name: "",
    dob: "",
    gender: "",
    phoneno: "",
    email: "",
    pass: "",
    cpass: "",
    check: false,
  });

  useEffect(() => {
    const savedSignUp = localStorage.getItem("signup");

    if (savedSignUp) {
      setSignup(JSON.parse(savedSignUp));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSignup({
      ...signup,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signup.pass !== signup.cpass) {
      alert("Passwords do not match");
      return;
    }

    if (!signup.check) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    localStorage.setItem("signup", JSON.stringify(signup));

    alert("Sign up saved!");
  };

  return (
    <div className="signup-page">
      <div className="signup-box">

        <h2>Sign Up</h2>
        <p>Create an Account to get started with your MediLink journey</p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={signup.name}
            onChange={handleChange}
            required
          />

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={signup.dob}
            onChange={handleChange}
            required
          />

          <label>Gender</label>

          <div className="gender-options">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={signup.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={signup.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>

          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneno"
            placeholder="Enter your phone number"
            value={signup.phoneno}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={signup.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="pass"
            placeholder="Create a password"
            value={signup.pass}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="cpass"
            placeholder="Confirm your password"
            value={signup.cpass}
            onChange={handleChange}
            required
          />

          <label className="terms">
            <input
              type="checkbox"
              name="check"
              checked={signup.check}
              onChange={handleChange}
            />
            I agree to the Terms & Conditions.
          </label>

          <button type="submit" className="signup-btn">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
};

export default SignUp;