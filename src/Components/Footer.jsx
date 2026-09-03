function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-section">
          <h2>MediLink</h2>
          <p>
            Your health information,
            <br />
            organized in one place.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/records">Medical Records</a>
          <a href="/profile">Profile</a>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>✉ support@medilink.com</p>
          <p>☎ Emergency: 112</p>
        </div>

      </div>

      <div className="copyright">
        <p>© 2026 MediLink. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;