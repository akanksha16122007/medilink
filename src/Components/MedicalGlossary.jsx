
import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faBookMedical,
  faMagnifyingGlass,
  faArrowRight,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faStar,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";
import medicalGlossary from "../data/medicalGlossary";

function MedicalGlossary() {
  const [search, setSearch] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [level, setLevel] = useState("easy");
  const [stepIndex, setStepIndex] = useState(0);

  const navigate = useNavigate();

  const handleClose = () => {
    const returnPath = sessionStorage.getItem("glossaryReturnPath");
    const scrollY = sessionStorage.getItem("glossaryScrollY");

    if (returnPath) {
      navigate(returnPath, {
        state: { restoreScrollY: Number(scrollY || 0) }
      });
    } else {
      navigate(-1);
    }
  };

  const termOfTheDay = useMemo(() => {
    if (!medicalGlossary || medicalGlossary.length === 0) return null;

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return medicalGlossary[dayOfYear % medicalGlossary.length];
  }, []);

  const filteredTerms = medicalGlossary.filter(
    (term) =>
      term.name.toLowerCase().includes(search.toLowerCase()) ||
      term.category.toLowerCase().includes(search.toLowerCase())
  );

  const openTerm = (term) => {
    setSelectedTerm(term);
    setLevel("easy");
    setStepIndex(0);
  };

  const closePopup = () => {
    setSelectedTerm(null);
    setStepIndex(0);
  };

  const steps = selectedTerm?.visualSteps || [];
  const currentStep = steps[stepIndex];

  return (
    <main className="glossary-page">
      <button
        type="button"
        className="glossary-close-btn"
        onClick={handleClose}
        aria-label="Close Medical Glossary"
      >
        <FontAwesomeIcon icon={faXmark} /> Close
      </button>

      <div className="glossary-top-layout">
        <div className="glossary-heading">
          <span className="glossary-icon">
            <FontAwesomeIcon icon={faBookMedical} />
          </span>

          <div>
            <h1>Medical Glossary</h1>
            <p>Understand medical terms, one simple step at a time.</p>
          </div>
        </div>

        {termOfTheDay && (
          <div
            className="term-of-the-day-banner"
            onClick={() => openTerm(termOfTheDay)}
            role="button"
            tabIndex={0}
          >
            <div className="totd-badge">
              <FontAwesomeIcon icon={faStar} /> Term of the Day
            </div>

            <div className="totd-content">
              <div className="totd-icon">
                <FontAwesomeIcon
                  icon={termOfTheDay.icon || faLightbulb}
                />
              </div>

              <div className="totd-text">
                <h3>{termOfTheDay.name}</h3>
                <span className="totd-category">
                  {termOfTheDay.category}
                </span>
                <p>{termOfTheDay.easy || termOfTheDay.definition}</p>
              </div>
            </div>

            <button
              className="totd-action-btn"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openTerm(termOfTheDay);
              }}
            >
              Learn More <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}
      </div>

      <div className="glossary-search">
        <FontAwesomeIcon icon={faMagnifyingGlass} />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search a medical term..."
          aria-label="Search medical terms"
        />
      </div>

      <p className="glossary-count">
        {filteredTerms.length} medical terms
      </p>

      <section className="glossary-grid">
        {filteredTerms.map((term) => (
          <button
            type="button"
            className="glossary-term-card"
            key={term.id}
            onClick={() => openTerm(term)}
          >
            <span className="term-card-icon">
              <FontAwesomeIcon icon={term.icon} />
            </span>

            <span className="term-card-content">
              <strong>{term.name}</strong>
              <small>{term.category}</small>
            </span>

            <span className="term-card-arrow">
              <FontAwesomeIcon icon={faArrowRight} />
            </span>
          </button>
        ))}

        {filteredTerms.length === 0 && (
          <div className="glossary-empty">
            <h3>No matching terms</h3>
            <p>Try searching for another medical term.</p>
          </div>
        )}
      </section>

      {selectedTerm && (
        <div className="glossary-overlay" onClick={closePopup}>
          <section
            className="glossary-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="glossary-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="glossary-close"
              onClick={closePopup}
              aria-label="Close popup"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h2 id="glossary-modal-title">{selectedTerm.name}</h2>
            <p className="modal-intro">{selectedTerm.category}</p>

            <div className="glossary-levels">
              {["easy", "medium", "hard"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`level-button ${
                    level === item ? "active" : ""
                  }`}
                  onClick={() => setLevel(item)}
                  aria-pressed={level === item}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            <div className="glossary-definition">
              <span className="definition-label">
                {level.toUpperCase()} EXPLANATION
              </span>
              <p>{selectedTerm[level]}</p>
            </div>

            {steps.length > 0 && currentStep && (
              <div className="visual-section">
                <div className="visual-heading">
                  <div>
                    <span className="visual-eyebrow">
                      LEARN VISUALLY
                    </span>
                    <h3>How it works</h3>
                  </div>

                  <span className="step-counter">
                    Step {stepIndex + 1} of {steps.length}
                  </span>
                </div>

                <div className="visual-progress">
                  {steps.map((step, index) => (
                    <span
                      key={step.title}
                      className={
                        index <= stepIndex ? "progress-filled" : ""
                      }
                    />
                  ))}
                </div>

                <div className="visual-step" aria-live="polite">
                  <div className="visual-symbol">
                    <FontAwesomeIcon icon={currentStep.icon} />
                  </div>

                  <h4>{currentStep.title}</h4>
                  <p>{currentStep.description}</p>
                </div>

                <div className="visual-navigation">
                  <button
                    type="button"
                    className="visual-nav-button previous-button"
                    disabled={stepIndex === 0}
                    onClick={() =>
                      setStepIndex((previous) => previous - 1)
                    }
                  >
                    <FontAwesomeIcon icon={faChevronLeft} /> Previous
                  </button>

                  <button
                    type="button"
                    className="visual-nav-button next-button"
                    disabled={stepIndex === steps.length - 1}
                    onClick={() =>
                      setStepIndex((previous) =>
                        Math.min(previous + 1, steps.length - 1)
                      )
                    }
                  >
                    {stepIndex === steps.length - 1
                      ? "Completed ✓"
                      : "Next step"}
                    {" "}
                    {stepIndex < steps.length - 1 && (
                      <FontAwesomeIcon icon={faChevronRight} />
                    )}
                  </button>
                </div>
              </div>
            )}

            <p className="glossary-disclaimer">
              For educational purposes only. Consult a qualified
              healthcare professional for medical advice.
            </p>
          </section>
        </div>
      )}
    </main>
  );
}

export default MedicalGlossary;
