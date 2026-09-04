import React from "react";
import { Link } from "react-router-dom";
const SignUp = () => {
  return (
    <div>
      <form>
        <label>Full Name</label>
        <input type="text" className="name" />
        <label>Date of Birth</label>
        <input type="date" className="dob" />
        <label>Gender</label>
        <input type="radio" className="gender" />
        Male
        <input type="radio" className="gender" />
        Female
        <label>Phone Number</label>
        <input type="tel" className="phoneno" />
        <label>Email Address</label>
        <input type="email" className="email" />
        <label>Password</label>
        <input type="password" className="pass" />
        <label>Confirm Password</label>
        <input type="password" className="pass" />
        <label>Terms</label>
        <input type="checkbox" className="check" />I agree to the Terms &
        Conditions.
        <button className="submit" type="button">
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
