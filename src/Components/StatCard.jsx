import React from "react";

const StatCard = ({ icon, number, title }) => {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-info">
        <h2>{number}</h2>
        <p>{title}</p>
      </div>

    </div>
  );
};

export default StatCard;