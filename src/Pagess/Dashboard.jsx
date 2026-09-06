import React from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";
import PrescriptionCard from "../Components/PrescriptionCard";

const Dashboard = () => {
  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  const savedRecords = localStorage.getItem("medilinkRecords");
  const records = savedRecords ? JSON.parse(savedRecords) : [];

  const savedPrescriptions = localStorage.getItem("medilinkPrescriptions");
  const prescriptions = savedPrescriptions
    ? JSON.parse(savedPrescriptions)
    : [];

  const uniqueDoctors = new Set(
    records.map((record) => record.doctor)
  ).size;

  const recentRecords = records.slice(0, 3);
  const recentPrescriptions = prescriptions.slice(0, 3);

  return (
    <div className="dashboard">
      <div className="dashboard-intro">
        <p className="dashboard-eyebrow">YOUR HEALTH AT A GLANCE</p>

        <h2>
          Hello, {profile.name || "User"}!{" "}
          <span aria-hidden="true">👋</span>
        </h2>

        <p>Here’s your health overview. Stay informed and prepared.</p>
      </div>

      <div className="stats-container">
        <StatCard
          icon="📄"
          number={records.length}
          title="Medical Records"
        />

        <StatCard
          icon="💊"
          number={prescriptions.length}
          title="Prescriptions"
        />

        <StatCard
          icon="👤"
          number={uniqueDoctors}
          title="Doctors"
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
              Recent medicines
            </span>
          </div>

          {recentPrescriptions.length > 0 ? (
            recentPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                medicine={prescription.medicine}
                dosage={prescription.dosage}
                date={prescription.date}
              />
            ))
          ) : (
            <div className="dashboard-empty">
              <span aria-hidden="true">💊</span>
              <p>No prescriptions added yet.</p>
            </div>
          )}
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
    </div>
  );
};

export default Dashboard;