import React from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";
import PrescriptionCard from "../Components/PrescriptionCard";
const profile = JSON.parse(localStorage.getItem("profile")) || {};
const Dashboard = () => {

const savedRecords = localStorage.getItem("medilinkRecords");

const records = savedRecords
  ? JSON.parse(savedRecords)
  : [];

const savedPrescriptions =
  localStorage.getItem("medilinkPrescriptions");

const uniqueDoctors = new Set(
records.map((record) => record.doctor)
).size;

const prescriptions = savedPrescriptions
  ? JSON.parse(savedPrescriptions)
  : [];

  return (
    <div className="dashboard">

      <h2>Hello, {profile.name || "User"}! 👋</h2>
      <p>Here's your health overview.</p>

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

  {/* Recent Medical Records */}
  <div className="section-box">

    <div className="section-header">
      <h3>Recent Medical Records</h3>
        <Link to="/records">
            <button>View All</button>
        </Link>
    </div>

    {records.map((record) => (
      <div className="dashboard-record" key={record.id}>

    <div>
        <h4>{record.type}</h4>
        <p>Dr. {record.doctor}</p>
    </div>

        <div>
          <span>{record.date}</span>
            <Link to="/records">
                <button>View</button>
            </Link>
        </div>

      </div>
    ))}

  </div>


  {/* Recent Prescriptions */}
  <div className="section-box">

    <div className="section-header">
      <h3>Recent Prescriptions</h3>
      <button>View All</button>
    </div>

   {prescriptions.map((prescription) => (
  <PrescriptionCard
    key={prescription.id}
    medicine={prescription.medicine}
    dosage={prescription.dosage}
    date={prescription.date}
  />
))} 

  </div>

</div>

    </div>
  );
};

export default Dashboard;