import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FONT_SIZES = ["small", "medium", "large"];

const getSavedFontSize = () => {
  try {
    const savedSize = localStorage.getItem("medilinkFontSize");
    return FONT_SIZES.includes(savedSize) ? savedSize : "medium";
  } catch {
    return "medium";
  }
};

const getSavedReducedMotion = () => {
  try {
    return localStorage.getItem("medilinkReducedMotion") === "true";
  } catch {
    return false;
  }
};

const Settings = ({ darkMode = false, toggleTheme }) => {
  const [fontSize, setFontSize] = useState(getSavedFontSize);
  const [reducedMotion, setReducedMotion] = useState(
    getSavedReducedMotion
  );

  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;

    try {
      localStorage.setItem("medilinkFontSize", fontSize);
    } catch {
      // Continue if browser storage is unavailable.
    }
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion =
      String(reducedMotion);

    try {
      localStorage.setItem(
        "medilinkReducedMotion",
        String(reducedMotion)
      );
    } catch {
      // Continue if browser storage is unavailable.
    }
  }, [reducedMotion]);

  const handleFontSizeChange = (size) => {
    if (FONT_SIZES.includes(size)) {
      setFontSize(size);
    }
  };

  const resetSettings = () => {
    const confirmed = window.confirm(
      "Restore the default MediLink appearance and accessibility settings?"
    );

    if (!confirmed) return;

    setFontSize("medium");
    setReducedMotion(false);

    if (darkMode && toggleTheme) {
      toggleTheme();
    }
  };
  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">
            YOUR ACCOUNT / PREFERENCES
          </p>

          <h1>Settings <FontAwesomeIcon icon={faGear} className="vault-icon" spin></FontAwesomeIcon></h1>

          <p className="settings-subtitle">
            Make MediLink more comfortable for you.
          </p>
        </div>

        <div className="settings-save-status">
          <span className="settings-status-dot" />
          Saved automatically
        </div>
      </header>

      <section className="settings-profile-card">
        <div className="settings-avatar">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="Profile avatar"
          />
        </div>

        <div className="settings-profile-content">
          <span className="settings-profile-label">
            YOUR HEALTH, YOUR SPACE
          </span>

          <h2>Personalize your experience</h2>

          <p>
            Keep your personal details, medical information, and emergency
            contact organized in one place.
          </p>

          <Link to="/profile" className="settings-profile-link">
            View profile <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div
          className="settings-profile-symbol"
          aria-hidden="true"
        >
          +
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div
            className="settings-section-icon"
            aria-hidden="true"
          >
            ◐
          </div>

          <div>
            <h2>Appearance</h2>
            <p>
              Set up the look and readability of your workspace.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Color theme</h3>
            <p>
              Choose the interface that feels right for you.
            </p>
          </div>

          <div className="settings-option-control">
            <span className="settings-current-value">
              {darkMode ? "Dark" : "Light"}
            </span>

            <button
              type="button"
              role="switch"
              aria-label="Dark theme"
              aria-checked={Boolean(darkMode)}
              className={`settings-switch ${
                darkMode ? "active" : ""
              }`}
              onClick={toggleTheme}
              disabled={!toggleTheme}
            >
              <span className="settings-switch-thumb" />
            </button>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Website text size</h3>
            <p>
              Adjust text across MediLink for more comfortable reading.
            </p>
          </div>

          <div
            className="settings-size-control"
            role="group"
            aria-label="Website text size"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={fontSize === size}
                className={
                  fontSize === size ? "selected" : ""
                }
                onClick={() => handleFontSizeChange(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div
            className="settings-section-icon"
            aria-hidden="true"
          >
            Aa
          </div>

          <div>
            <h2>Reading Assistance</h2>
            <p>
              Listen to health information using MediLink's
              text-to-speech feature.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Read Selected Text</h3>
            <p>
              Select text on the page and click Read Selected Text
              in the top toolbar to hear it aloud.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Pause / Resume</h3>
            <p>
              Pause the current speech or resume listening whenever
              you are ready.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Stop Speaking</h3>
            <p>
              Stop the current audio playback whenever you need to.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Speech Speed</h3>
            <p>
              Choose Slow, Normal, or Fast using the Speed selector
              in the top toolbar.
            </p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-heading">
          <div
            className="settings-section-icon"
            aria-hidden="true"
          >
            ◎
          </div>

          <div>
            <h2>Accessibility</h2>
            <p>
              Choose options that support your comfort.
            </p>
          </div>
        </div>

        <div className="settings-option">
          <div className="settings-option-text">
            <h3>Reduce motion</h3>
            <p>
              Minimize interface animations and transitions.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-label="Reduce motion"
            aria-checked={reducedMotion}
            className={`settings-switch ${
              reducedMotion ? "active" : ""
            }`}
            onClick={() =>
              setReducedMotion((previous) => !previous)
            }
          >
            <span className="settings-switch-thumb" />
          </button>
        </div>
      </section>

      <section className="settings-reset-card">
        <div
          className="settings-reset-icon"
          aria-hidden="true"
        >
          ↺
        </div>

        <div className="settings-reset-content">
          <h2>Restore default preferences</h2>
          <p>
            Return to the default theme, medium text, and normal motion.
          </p>
        </div>

        <button
          type="button"
          className="settings-reset-button"
          onClick={resetSettings}
        >
          Reset settings
        </button>
      </section>

      <footer className="settings-footer">
        <span className="settings-footer-brand">MediLink</span>
        <span>Personal health management</span>
      </footer>
    </main>
  );
};

export default Settings;