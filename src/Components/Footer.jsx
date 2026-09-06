import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* BRAND */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">✚</span>
            <span>MediLink</span>
          </div>

          <p>
            Your health information,
            <br />
            organized in one place.
          </p>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <div className="footer-link-list">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/records">Medical Records</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </div>


        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact</h3>

          <p>✉ support@medilink.com</p>
          <p>☎ Emergency: 112</p>
        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="copyright">
        <p>© 2026 MediLink. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;