import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const SignUp = () => {
  const [SignUp, setSignUp] = useState({
    name: "",
    dob: "",
    phoneno: "",
    email: "",
    pass: "",
    cpass: "",
    check: "",
  });
  useEffect(() => {
    const savedSignUp = localStorage.getItem("signup");
    if (savedSignUp) {
      setSignUp(JSON.parse(savedSignUp));
    }
  }, []);
  const samepass = () => {
    if (SignUp.pass === SignUp.cpass) {
      return true;
    } else {
      return false;
    }
  };
  const handleChange = (e) => {
    setSignUp({
      ...SignUp,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!samepass()) {
      alert("passwords do not match");
      return;
    }
    localStorage.setItem("signup", JSON.stringify(SignUp));
    alert("Sign up saved");
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          type="text"
          className="name"
          name="name"
          onChange={handleChange}
          value={SignUp.name}
        />
        <label>Date of Birth</label>
        <input
          type="date"
          className="dob"
          name="dob"
          onChange={handleChange}
          value={SignUp.dob}
        />
        <label>Gender</label>
        <input type="radio" className="gender" />
        Male
        <input type="radio" className="gender" />
        Female
        <label>Phone Number</label>
        <input
          type="tel"
          className="phoneno"
          name="phoneno"
          value={SignUp.phoneno}
          onChange={handleChange}
        />
        <label>Email Address</label>
        <input
          type="email"
          className="email"
          value={SignUp.email}
          name="email"
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          className="pass"
          value={SignUp.pass}
          onChange={handleChange}
          name="pass"
        />
        <label>Confirm Password</label>
        <input
          type="password"
          className="cpass"
          name="cpass"
          value={SignUp.cpass}
          onChange={handleChange}
        />
        <input
          type="checkbox"
          className="check"
          value={SignUp.check}
          name="check"
          onChange={handleChange}
        />
        I agree to the Terms & Conditions.
        <button className="submit" onSubmit={handleSubmit}>
          Create Account
        </button>
        <p>
          Already have an account?
          <button>
            <Link to="/login">Login</Link>
          </button>
        </p>
      </form>
    </div>
  );
};
export default SignUp;
