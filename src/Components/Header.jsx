import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <h1>MediLink</h1>

      <Link to="/">
        <button>Home</button>
      </Link>

      <button>Dashboard</button>

      <Link to="/records">
        <button>Records</button>
      </Link>

      <Link to="/profile">
        <button className="profile">Profile</button>
      </Link>
      {user ? (
        <div className="user-info">
          <img
            src={
              user?.profilePic ||
              "https://i.pinimg.com/736x/db/a9/ce/dba9ce433113b68e719456b6d78c4f2a.jpg"
            }
            alt="Profile"
            className="Profile-pic"
          />
          <span>{user.name}</span>
        </div>
      ) : (
        <Link to="/login">
          <button className="login">Login</button>
        </Link>
      )}
    </div>
  );
};

export default Header;
