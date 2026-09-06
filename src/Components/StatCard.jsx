import React from "react";

const StatCard = ({ icon, number, title, variant = "records" }) => {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-icon">{icon}</div>

      <div className="stat-info">
        <p>{title}</p>
        <h2>{number}</h2>
      </div>
    </div>
  );
};

export default StatCard;