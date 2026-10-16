import React from "react";

const formatDisplayDate = (value) => {
  if (!value) return "";
  const input = String(value).trim();
  let match = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  let year, month, day;
  if (match) [, year, month, day] = match;
  else {
    match = input.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
      day = match[1]; year = match[3];
      month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].findIndex((name) => name === match[2].slice(0, 3).toLowerCase()) + 1;
    } else {
      match = input.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
      if (!match) return input;
      day = match[1]; month = match[2]; year = match[3];
    }
  }
  const y = Number(year), m = Number(month), d = Number(day);
  const parsed = new Date(y, m - 1, d);
  if (!y || m < 1 || m > 12 || d < 1 || d > 31 || parsed.getFullYear() !== y || parsed.getMonth() !== m - 1 || parsed.getDate() !== d) return input;
  return `${String(d).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
};

const RecordCard = ({ record, onView, onEdit, onDelete, onPrint }) => {
  const getIcon = (type) => {
    const cleanType = (type || "").replace(/^[^\w\s]+\s*/, "");
    switch (cleanType) {
      case "Blood Test": return "🩸";
      case "X-Ray Chest": return "🩻";
      case "ECG Report": return "❤️";
      case "MRI Brain": return "🧠";
      default: return "🏥";
    }
  };

  return (
    <article className="record-card">
      <div className="record-icon" aria-hidden="true">{getIcon(record.type)}</div>
      <div className="record-info">
        <h3>{(record.type || "Medical Record").replace(/^[^\w\s]+\s*/, "")}</h3>
        <p className="doctor-name">Dr. {record.doctor || "Not provided"}</p>
        <p className="doctor-phone"><strong>Phone:</strong> {record.doctorPhone || "Not provided"}</p>
        <p className="record-notes">{record.notes}</p>
      </div>
      <div className="record-date">{formatDisplayDate(record.date)}</div>
      <div className="record-actions">
        <button type="button" className="view-btn" onClick={() => onView(record)}>View</button>
        <button type="button" className="edit-record-btn" onClick={() => onEdit(record)}>Edit</button>
        <button type="button" className="print-record-btn" onClick={() => onPrint(record)}>Print</button>
        <button type="button" className="delete-btn" onClick={() => onDelete(record.id)}>Delete</button>
      </div>
    </article>
  );
};

export default RecordCard;
