
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  faGear,
  faRightFromBracket,
  faUser,
  faPalette,
  faUniversalAccess,
  faRotateLeft,
  faVolumeHigh,
  faBookMedical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getSavedReducedMotion = () => {
  try {
    return localStorage.getItem("medilinkReducedMotion") === "true";
  } catch {
    return false;
  }
};

const Settings = ({ darkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [reducedMotion, setReducedMotion] = useState(
    getSavedReducedMotion
  );

  // Apply reduced motion globally and persist the preference.
  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      reducedMotion
    );

    try {
      localStorage.setItem(
        "medilinkReducedMotion",
        String(reducedMotion)
      );
    } catch {
      // The setting still applies for the current session.
    }
  }, [reducedMotion]);

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset your appearance and accessibility settings to their defaults?"
    );

    if (!confirmed) return;
    setReducedMotion(false);

    if (darkMode) {
      toggleTheme();
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="settings-page">
      <div className="settings-content">
        <header className="settings-header">
          <div className="settings-eyebrow">
            <span>PERSONAL PREFERENCES</span>
          </div>

          <h1>
            Settings { }
            <FontAwesomeIcon
              icon={faGear}
              className="vault-icon" spin
            />
          </h1>

          <p>Customize your MediLink experience to suit your needs.</p>
        </header>

        {/* Profile */}
        <Link to="/profile" className="settings-profile-card">
          <div className="settings-profile-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <div className="settings-profile-info">
            <h3>Profile Settings</h3>
            <p>View and manage your personal information.</p>
          </div>

          <span className="settings-arrow" aria-hidden="true">
            →
          </span>
        </Link>

        {/* Appearance */}
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <FontAwesomeIcon icon={faPalette} />
            </div>

            <div>
              <h2>Appearance</h2>
              <p>Personalize how MediLink looks.</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes.</p>
            </div>

            <button
              type="button"
              className={`settings-switch ${darkMode ? "active" : ""}`}
              role="switch"
              aria-checked={Boolean(darkMode)}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              <span />
            </button>
          </div>
        </section>

        {/* Accessibility */}
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon">
              <FontAwesomeIcon icon={faUniversalAccess} />
            </div>

            <div>
              <h2>Accessibility</h2>
              <p>Make MediLink more comfortable to use.</p>
            </div>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <div className="settings-option-title">
                <FontAwesomeIcon
                  icon={faVolumeHigh}
                  className="settings-inline-icon"
                />
                <h3>Reading Assistance</h3>
              </div>

              <p>
                Use the reading toolbar to listen to selected text,
                control playback, and adjust reading speed.
              </p>
            </div>

            <span className="settings-info-label">
              Available in toolbar
            </span>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <div className="settings-option-title">
                <FontAwesomeIcon
                  icon={faBookMedical}
                  className="settings-inline-icon"
                />
                <h3>Medical Glossary</h3>
              </div>

              <p>
                Explore simple explanations of medical terms, health
                conditions, and common healthcare terminology.
              </p>
            </div>

            <span className="settings-info-label">
              Available in Resources
            </span>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <h3>Reduced Motion</h3>
              <p>
                Minimize animations and transitions throughout the
                application where supported.
              </p>
            </div>

            <button
              type="button"
              className={`settings-switch ${
                reducedMotion ? "active" : ""
              }`}
              role="switch"
              aria-checked={reducedMotion}
              aria-label="Toggle reduced motion"
              onClick={() =>
                setReducedMotion((previous) => !previous)
              }
            >
              <span />
            </button>
          </div>
        </section>

        {/* Reset */}
        <section className="settings-reset-card">
          <div className="settings-reset-icon">
            <FontAwesomeIcon icon={faRotateLeft} />
          </div>

          <div className="settings-reset-content">
            <h3>Reset Settings</h3>
            <p>
              Restore appearance and accessibility preferences to
              their default values.
            </p>
          </div>

          <button
            type="button"
            className="settings-reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </section>

        {/* Logout */}
        <section className="settings-logout-card">
          <div className="settings-logout-symbol">
            <FontAwesomeIcon icon={faRightFromBracket} />
          </div>

          <div className="settings-logout-content">
            <h3>Sign Out</h3>
            <p>Sign out of your MediLink account on this device.</p>
          </div>

          <button
            type="button"
            className="settings-logout-button"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
          </button>
        </section>

        <footer className="settings-footer">
          <p>MediLink · Your health, connected.</p>
        </footer>
      </div>
    </main>
  );
};

export default Settings;