import React from "react";

const PrescriptionCard = ({ medicine, dosage, date, onMedicineInfo }) => {
  return (
    <div className="prescription-card">

      <div className="prescription-details">
        <h4>{medicine}</h4>
        <p>{dosage}</p>
      </div>

      <div className="prescription-actions">
        <span>{date}</span>

        <button onClick={() => onMedicineInfo(medicine)}>
          Medicine Info
        </button>
      </div>

    </div>
  );
};

export default PrescriptionCard;