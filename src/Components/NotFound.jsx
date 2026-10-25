import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFileCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <FontAwesomeIcon icon={faFileCircleExclamation} />
        </div>

        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        
        <p className="not-found-message">
          The medical record or page you are looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="not-found-home-btn">
          <FontAwesomeIcon icon={faHouse} />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}