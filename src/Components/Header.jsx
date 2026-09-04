import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div>
      <h1>MediLink</h1>
      <button>Home</button>
      <button>Dashboard</button>
      <button>Records</button>
      <Link to="/profile">
        <button className="profile">Profile</button>
      </Link>
      <Link to="/login">
        <button className="login">Login</button>
      </Link>
    </div>
  );
};
export default Header;
