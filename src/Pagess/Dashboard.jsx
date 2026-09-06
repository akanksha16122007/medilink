import React, { useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";
import PrescriptionCard from "../Components/PrescriptionCard";

const Dashboard = () => {
  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  const savedRecords = localStorage.getItem("medilinkRecords");
  const records = savedRecords ? JSON.parse(savedRecords) : [];

  const savedPrescriptions = localStorage.getItem("medilinkPrescriptions");

  // Demo prescription: API feature ko presentation mein test karne ke liye.
  const prescriptions = savedPrescriptions
    ? JSON.parse(savedPrescriptions)
    : [
        {
          id: 1,
          medicine: "Acetaminophen",
          dosage: "500mg • 5 Days",
          date: "Today",
        },
      ];

  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [medicineInfo, setMedicineInfo] = useState(null);
  const [isLoadingMedicine, setIsLoadingMedicine] = useState(false);
  const [medicineError, setMedicineError] = useState("");

  const uniqueDoctors = new Set(
    records.map((record) => record.doctor)
  ).size;

  const recentRecords = records.slice(0, 3);
  const recentPrescriptions = prescriptions.slice(0, 3);

  const handleMedicineInfo = async (medicine) => {
    setSelectedMedicine(medicine);
    setMedicineInfo(null);
    setMedicineError("");
    setIsLoadingMedicine(true);

    try {
      const query = `openfda.generic_name:"${medicine}"`;

      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(
          query
        )}&limit=1`
      );

      if (!response.ok) {
        throw new Error("Medicine information not found.");
      }

      const data = await response.json();
      const label = data.results[0];

      setMedicineInfo({
        name: label.openfda?.generic_name?.[0] || medicine,
        brand: label.openfda?.brand_name?.[0] || "Not available",
        purpose:
          label.purpose?.[0] ||
          label.indications_and_usage?.[0] ||
          "Not available",
        warnings:
          label.warnings?.[0] ||
          label.warnings_and_cautions?.[0] ||
          "No warning information available.",
      });
    } catch (error) {
      setMedicineError(
        "We could not find official information for this medicine."
      );
    } finally {
      setIsLoadingMedicine(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-intro dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="dashboard-eyebrow">MEDILINK HEALTH DASHBOARD</p>

          <h2>
            Hello, {profile.name || "User"}!{" "}
            <span aria-hidden="true">👋</span>
          </h2>

          <p>
            Your medical information, prescriptions, and emergency details —
            organized in one secure place.
          </p>

          <div className="dashboard-health-status">
            <span></span>
            Your health workspace is ready
          </div>
        </div>

        <div className="dashboard-hero-symbol" aria-hidden="true">
          ✚
        </div>
      </div>

      <div className="stats-container">
        <StatCard
          icon="📄"
          number={records.length}
          title="Medical Records"
          variant="records"
        />

        <StatCard
          icon="💊"
          number={prescriptions.length}
          title="Prescriptions"
          variant="prescriptions"
        />

        <StatCard
          icon="👤"
          number={uniqueDoctors}
          title="Doctors"
          variant="doctors"
        />
      </div>

      <div className="dashboard-sections">
        <section className="section-box">
          <div className="section-header">
            <h3>Recent Medical Records</h3>

            <Link className="section-link" to="/records">
              View All <span>→</span>
            </Link>
          </div>

          {recentRecords.length > 0 ? (
            recentRecords.map((record) => (
              <div className="dashboard-record" key={record.id}>
                <div className="dashboard-item-main">
                  <span className="dashboard-item-icon" aria-hidden="true">
                    📄
                  </span>

                  <div>
                    <h4>{record.type}</h4>
                    <p>Dr. {record.doctor}</p>
                  </div>
                </div>

                <div>
                  <span>{record.date}</span>

                  <Link to="/records">
                    <button>View</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="dashboard-empty">
              <span aria-hidden="true">📄</span>
              <p>No medical records yet.</p>
              <Link to="/records">Add your first record</Link>
            </div>
          )}
        </section>

        <section className="section-box">
          <div className="section-header">
            <h3>Recent Prescriptions</h3>

            <span className="section-link section-link-muted">
              Medicine details
            </span>
          </div>

          {recentPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              medicine={prescription.medicine}
              dosage={prescription.dosage}
              date={prescription.date}
              onMedicineInfo={handleMedicineInfo}
            />
          ))}
        </section>
      </div>

      <section
        className="emergency-card"
        aria-labelledby="emergency-heading"
      >
        <div className="emergency-copy">
          <span className="emergency-icon" aria-hidden="true">
            ✚
          </span>

          <div>
            <p className="emergency-label">IMPORTANT FOR URGENT CARE</p>
            <h3 id="emergency-heading">Emergency Information</h3>

            <p>
              Keep these details current so they are available when needed.
            </p>
          </div>
        </div>

        <div className="emergency-details">
          <div>
            <span>Blood Group</span>
            <strong>{profile.bloodGroup || "Not added"}</strong>
          </div>

          <div>
            <span>Emergency Contact</span>
            <strong>{profile.phoneno || "Not added"}</strong>
          </div>
        </div>

        <Link className="emergency-button" to="/profile">
          View Full Profile
        </Link>
      </section>

      {selectedMedicine && (
        <div
          className="medicine-modal-overlay"
          onClick={() => setSelectedMedicine("")}
        >
          <div
            className="medicine-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="medicine-modal-close"
              onClick={() => setSelectedMedicine("")}
            >
              ×
            </button>

            <p className="medicine-modal-label">
              OPENFDA MEDICINE INFORMATION
            </p>

            <h3>{selectedMedicine}</h3>

            {isLoadingMedicine && (
              <p className="medicine-loading">
                Fetching official medicine information...
              </p>
            )}

            {medicineError && (
              <p className="medicine-error">{medicineError}</p>
            )}

            {medicineInfo && (
              <>
                <div className="medicine-detail">
                  <span>Generic Name</span>
                  <strong>{medicineInfo.name}</strong>
                </div>

                <div className="medicine-detail">
                  <span>Brand Name</span>
                  <strong>{medicineInfo.brand}</strong>
                </div>

                <div className="medicine-detail">
                  <span>Purpose / Uses</span>
                  <p>{medicineInfo.purpose}</p>
                </div>

                <div className="medicine-detail">
                  <span>Warnings</span>
                  <p>{medicineInfo.warnings}</p>
                </div>

                <p className="medicine-disclaimer">
                  Information is sourced from public FDA drug-label data.
                  Please consult a healthcare professional for medical advice.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;