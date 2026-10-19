import React, { useEffect } from "react";
const EmergencyHealthPage = () => {
  const getSavedData = (key) => {
    const saveData = localStorage.getItem(key);
    try {
      return JSON.parse(saveData) || {};
    } catch {
      return {};
    }
  };
  const personalInfo = getSavedData("personalInfo");
  const personalDetails = getSavedData("personalDetails");
  const medicalInfo = getSavedData("medicalInfo");
  const emergencyInfo = getSavedData("emergencyInfo");
  const handleCall = () => {
    if (!emergencyInfo.phone) return;
    window.location.href = `tel:${emergencyInfo.phone}`;
  };
  useEffect(() => {
    if (window.location.search.includes("print=true")) {
      const timer = setTimeout(() => {
        window.print();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);
  return (
    <div className="EmergencyHealthPage">
      <div className="header-page">
        <h1>
          {" "}
          <i class="fa-solid fa-briefcase-medical"></i> Emergency Health ID
        </h1>
        <p>Essential medical information</p>
      </div>
      <div className="patient-details">
        <h3>Patient Details</h3>
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          alt="profile-img"
        />
        <h4>{personalInfo.name}</h4>
        <p>
          {personalDetails.age} years · {personalInfo.gender}
        </p>
      </div>
      <div className="critical-medical-info">
        <h4>
          <i class="fa-solid fa-droplet"></i> Blood Group
        </h4>
        <p>{medicalInfo.bloodGroup}</p>
        <h4>
          <i class="fa-solid fa-triangle-exclamation"></i> Allergies
        </h4>
        <p>{medicalInfo.allergies}</p>
        <h4>Chronic Conditions</h4>
        <p>{medicalInfo.chronicConditions}</p>
      </div>
      <div className="emergency-contact">
        <h3>
          <i class="fa-solid fa-phone-volume"></i> Emergency Contact
        </h3>
        <h4>{emergencyInfo.name}</h4>
        <p>
          {emergencyInfo.relation} · {emergencyInfo.phone}
        </p>
        <button type="button" onClick={handleCall}>
          <i class="fa-solid fa-phone"></i> Call Emergency Contact
        </button>
        <h4>Address</h4>
        <p>{emergencyInfo.address}</p>
      </div>
      <div className="other-details">
        <h3>Other Medical Details</h3>
        <h4>
          <i class="fa-solid fa-capsules"></i> Current Medications
        </h4>
        <p>{medicalInfo.currentMedications}</p>
        <h4>
          <i class="fa-solid fa-stethoscope"></i> Past Illnesses
        </h4>
        <p>{medicalInfo.pastIllnesses}</p>
        <h4>
          <i class="fa-solid fa-clipboard"></i> Other medical notes
        </h4>
        <p>{medicalInfo.otherNotes}</p>
      </div>
    </div>
  );
};
export default EmergencyHealthPage;
