import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="header">

      {/* Logo */}
      <Link to="/" className="logo">
        <span className="logo-icon">✚</span>
        <span>MediLink</span>
      </Link>

      {/* Hamburger button */}
      <button
        className="menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Navigation */}
      <nav className={menuOpen ? "nav active" : "nav"}>

        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          Dashboard
        </Link>

        <Link to="/records" onClick={() => setMenuOpen(false)}>
          Records
        </Link>

        <Link to="/profile" onClick={() => setMenuOpen(false)}>
          Profile
        </Link>

        {/* Login / User */}
        {user ? (
          <div className="user-info">
            <img
              src={
                user?.profilePic ||
                "https://i.pinimg.com/736x/db/a9/ce/dba9ce433113b68e719456b6d78c4f2a.jpg"
              }
              alt="Profile"
              className="profile-pic"
            />

            <span>{user.name}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}

      </nav>

    </header>
  );
};

export default Header;
