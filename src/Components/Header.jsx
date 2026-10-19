import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ darkMode, toggleTheme }) => {
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const [speechRate, setSpeechRate] = useState(0.9);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getStoredUser());
    setMenuOpen(false);
    setShowLogOut(false);
  }, [location]);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowLogOut(false);
    closeMenu();
    navigate("/login");
  };

  const speakSelectedText = () => {
    const selectedText = String(window.getSelection() || "").trim();

    if (!selectedText) {
      alert("Please select some text first.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(selectedText);
    speech.lang = "en-IN";
    speech.rate = Number(speechRate);
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  const pauseOrResume = () => {
    if (!("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;

    if (synth.paused) {
      synth.resume();
    } else if (synth.speaking) {
      synth.pause();
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleProfileMenu = () => {
    setShowLogOut((previous) => !previous);
  };

  const handleProfileKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleProfileMenu();
    }
  };

  return (
    <header className="header">
      {/* ORIGINAL NAVBAR — preserve its existing classes */}
      <div className="header-main-row">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon">✚</span>
          <span>MediLink</span>
        </Link>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className={menuOpen ? "nav active" : "nav"}>
          <i
            className="fa-solid fa-bell"
            aria-label="Notifications"
            role="img"
          />

          {user ? (
            <div className="user-info">
              <div
                className="profile-section"
                onClick={toggleProfileMenu}
                onKeyDown={handleProfileKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={showLogOut}
              >
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

              {showLogOut && (
                <div className="logout-menu">
                  <button type="button" onClick={handleLogout}>
                    <i
                      className="fa-solid fa-arrow-right-from-bracket"
                      aria-hidden="true"
                    />{" "}
                    Logout
                  </button>

                  <button
                    type="button"
                    className="theme-menu-btn"
                    onClick={toggleTheme}
                  >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn" onClick={closeMenu}>
              Login
            </Link>
          )}
        </nav>
      </div>


{/* NEW SECOND BAR — below the original navbar */}
<div className="header-tools-bar">
  <Link
    to="/medical-glossary"
    className="glossary-nav-btn"
    onClick={() => {
      sessionStorage.setItem(
        "glossaryReturnPath",
        location.pathname + location.search
      );

      sessionStorage.setItem(
        "glossaryScrollY",
        String(window.scrollY)
      );

      closeMenu();
    }}
  >
    <i className="fa-solid fa-book-medical" aria-hidden="true" />
    <span>Medical Glossary</span>
  </Link>

  <div className="voice-settings">
    <label htmlFor="speech-rate">Speed:</label>
    <select
      id="speech-rate"
      value={speechRate}
      onChange={(event) => setSpeechRate(Number(event.target.value))}
    >
      <option value={0.7}>Slow</option>
      <option value={0.9}>Normal</option>
      <option value={1.25}>Fast</option>
    </select>
  </div>

  <div className="speech-controls">
    <button
      type="button"
      className="speech-btn"
      onClick={speakSelectedText}
      title="Read Selected Text Aloud"
    >
      <i className="fa-solid fa-volume-high" aria-hidden="true" /> Read
      Selected Text
    </button>

    <button
      type="button"
      className="speech-btn"
      onClick={pauseOrResume}
      title="Pause or Resume Speech"
    >
      <i className="fa-solid fa-pause" aria-hidden="true" /> Pause / Resume
    </button>

    <button
      type="button"
      className="speech-stop-btn"
      onClick={stopSpeaking}
      title="Stop Speaking"
    >
      <i className="fa-solid fa-stop" aria-hidden="true" /> Stop Speaking
    </button>
  </div>
</div>
</header>
  );
};

export default Header;
