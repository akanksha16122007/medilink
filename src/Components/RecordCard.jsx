import React from "react";

const RecordCard = ({ record, onView, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case "Blood Test":
        return "📄";
      case "X-Ray Chest":
        return "🩻";
      case "ECG Report":
        return "👤";
      case "MRI Brain":
        return "📄";
      default:
        return "📄";
    }
  };

  return (
    <div className="record-card">
      <div className="record-icon">
        {getIcon(record.type)}
      </div>

      <div className="record-info">
        <h3>{record.type}</h3>

        <p className="doctor-name">
          Dr. {record.doctor}
        </p>

        <p className="record-notes">
          {record.notes}
        </p>
      </div>

      <div className="record-date">
        {record.date}
      </div>

      <div className="record-actions">
        <button
          className="view-btn"
          onClick={() => onView(record)}
        >
          View
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(record.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecordCard;