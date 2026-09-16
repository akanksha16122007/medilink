
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";

const Dashboard = () => {
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile")) || {}
  );

  const [records, setRecords] = useState(
    JSON.parse(localStorage.getItem("medilinkRecords")) || []
  );

  const [privacyMode, setPrivacyMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setProfile(JSON.parse(localStorage.getItem("profile")) || {});
      setRecords(JSON.parse(localStorage.getItem("medilinkRecords")) || []);
    };

    window.addEventListener("profileUpdated", updateData);

    return () => {
      window.removeEventListener("profileUpdated", updateData);
    };
  }, []);

  const uniqueDoctors = new Set(
    records.map(r => r.doctor).filter(Boolean)
  ).size;

  const uniqueTypes = new Set(
    records.map(r => r.type).filter(Boolean)
  ).size;

  const recentRecords = records.slice(0, 3);

  const typeCount = {};

  records.forEach(r => {
    if (r.type) {
      typeCount[r.type] = (typeCount[r.type] || 0) + 1;
    }
  });

  let mostCommonType = "No records yet";

  Object.keys(typeCount).forEach(type => {
    if (
      mostCommonType === "No records yet" ||
      typeCount[type] > typeCount[mostCommonType]
    ) {
      mostCommonType = type;
    }
  });

  const fields = [
    profile.name,
    profile.age,
    profile.bloodGroup,
    profile.phoneno,
    profile.allergies,
    profile.medical
  ];

  const profileCompletion = Math.round(
    (fields.filter(Boolean).length / fields.length) * 100
  );

  const healthStatus =
    profileCompletion >= 76
      ? "Profile Ready"
      : profileCompletion >= 41
      ? "Partially Complete"
      : "Profile Incomplete";

  const healthStatusText =
    profileCompletion >= 76
      ? "Your essential health information is mostly complete."
      : profileCompletion >= 41
      ? "Add a few more details to complete your health profile."
      : "Complete your health profile to keep important information ready.";

  const copyEmergencyDetails = () => {
    const text = `
MediLink Emergency Information

Blood Group: ${profile.bloodGroup || "Not added"}
Emergency Contact: ${profile.phoneno || "Not added"}
Allergies: ${profile.allergies || "None"}
Medical Conditions: ${profile.medical || "None"}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard">

      <section className="dashboard-overview">
        <div className="overview-heading">
          <p className="dashboard-eyebrow">HEALTH OVERVIEW</p>

          <h2>
            Good to see you, {profile.name || "User"}{" "}
            <span>👋</span>
          </h2>

          <p>Your important health information at a glance.</p>
        </div>

      </section>


      <div className="stats-container">

        <StatCard
          icon="📄"
          number={records.length}
          title="Medical Records"
          variant="records"
        />

        <StatCard
          icon="👨‍⚕️"
          number={uniqueDoctors}
          title="Doctors"
          variant="doctors"
        />

        <StatCard
          icon="✓"
          number={`${profileCompletion}%`}
          title="Profile Complete"
          variant="blood"
        />

      </div>


      <div className="dashboard-main-grid">

        <section className="activity-section">

          <div className="section-heading">
            <div>
              <p className="section-eyebrow">YOUR RECORDS</p>
              <h3>Health Activity</h3>
            </div>

            <Link to="/records" className="section-link">
              All Records →
            </Link>
          </div>

          {recentRecords.length ? (
            <div className="activity-list">

              {recentRecords.map(record => (
                <div className="activity-item" key={record.id}>

                  <div className="activity-marker">
                    <span></span>
                  </div>

                  <div className="activity-content">

                    <div className="activity-top">
                      <h4>{record.type}</h4>
                      <span>{record.date}</span>
                    </div>

                    <p>
                      Dr. {record.doctor || "Not specified"}
                    </p>

                    {record.notes && <small>{record.notes}</small>}

                  </div>

                  <Link
                    to={`/records?view=${record.id}`}
                    className="activity-view"
                  >
                    View
                  </Link>

                </div>
              ))}

            </div>
          ) : (
            <div className="activity-empty">

              <span>📄</span>

              <div>
                <h4>No health activity yet</h4>
                <p>Your recent medical records will appear here.</p>
              </div>

              <Link to="/records">Add Record →</Link>

            </div>
          )}

        </section>


        <section className="environment-section">

          <div className="environment-header">
            <div>
              <p className="section-eyebrow">HEALTH & SAFETY</p>
              <h3>Medical Precautions</h3>
            </div>
          </div>

          <div className="precautions-grid">

            {[
              ["Keep Records Updated", "Keep your latest health records up to date."],
              ["Keep Allergies Updated", "Mention known allergies clearly in your profile."],
              ["Follow Prescribed Medicines", "Take medicines only as directed by your provider."],
              ["Keep Emergency Details Ready", "Keep blood group and emergency contact updated."]
            ].map(([title, text]) => (

              <div className="precaution-item" key={title}>

                <div className="precaution-icon">✓</div>

                <div>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </div>

              </div>

            ))}

          </div>

          <div className="environment-footer">
            General health and safety guidance
          </div>

        </section>

      </div>


      <section className="smart-health-card">

        <div className="smart-health-header">

          <div className="smart-health-title">

            <div className="smart-health-icon">🩺</div>

            <div>
              <p className="section-eyebrow">QUICK ACCESS</p>
              <h3>Smart Health Snapshot</h3>
              <p>Important health details available when you need them.</p>
            </div>

          </div>

          <button
            className={`privacy-toggle ${privacyMode ? "active" : ""}`}
            onClick={() => setPrivacyMode(!privacyMode)}
          >
            <span>{privacyMode ? "🔒" : "👁"}</span>
            {privacyMode ? "Privacy On" : "Privacy Mode"}
          </button>

        </div>


        <div className="smart-health-details">

          {[
            ["🩸", "Blood Group", profile.bloodGroup || "Not added"],
            ["⚠️", "Allergies", profile.allergies || "None"],
            ["☎", "Emergency Contact", profile.phoneno || "Not added"]
          ].map(([icon, title, value]) => (

            <div className="health-detail-box" key={title}>

              <span className="detail-icon">{icon}</span>

              <div>
                <p>{title}</p>

                <strong className={privacyMode ? "privacy-hidden" : ""}>
                  {value}
                </strong>
              </div>

            </div>

          ))}

        </div>


        <div className="smart-health-footer">

          <div className="snapshot-status">
            <span className="status-dot"></span>
            <span>Health information available</span>
          </div>

          <div className="snapshot-actions">

            <button
              className="copy-health-btn"
              onClick={copyEmergencyDetails}
            >
              {copied ? "✓ Copied!" : "Copy Details"}
            </button>

            <Link to="/profile" className="snapshot-profile-btn">
              Open Profile →
            </Link>

          </div>

        </div>

      </section>


      <section className="record-insights">

        <div className="insights-heading">

          <div>
            <p className="section-eyebrow">YOUR HEALTH DATA</p>

            <h3>Medical Records Insights</h3>

            <p>
              A simple overview of your stored medical records.
            </p>
          </div>

          <div className="insights-icon">📊</div>

        </div>


        <div className="insights-grid">

          <div className="insight-box">
            <span className="insight-number">{records.length}</span>
            <span className="insight-label">Total Records</span>
          </div>

          <div className="insight-box">
            <span className="insight-number">{uniqueDoctors}</span>
            <span className="insight-label">Doctors</span>
          </div>

          <div className="insight-box">
            <span className="insight-number">{uniqueTypes}</span>
            <span className="insight-label">Record Types</span>
          </div>

          <div className="insight-box wide-insight">
            <span className="insight-small-label">
              MOST COMMON RECORD
            </span>

            <strong>{mostCommonType}</strong>
          </div>

        </div>


        {records.length > 0 && (

          <div className="record-type-bars">

            <div className="bars-heading">
              Record Type Distribution
            </div>

            {Object.entries(typeCount).map(([type, count]) => (

              <div className="record-bar-row" key={type}>

                <div className="record-bar-label">
                  <span>{type}</span>
                  <strong>{count}</strong>
                </div>

                <div className="record-bar">

                  <div
                    className="record-bar-fill"
                    style={{
                      width: `${(count / records.length) * 100}%`
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      <section className="health-status-card">

        <div className="health-status-icon">
          {profileCompletion >= 76 ? "✓" : "!"}
        </div>

        <div className="health-status-content">

          <p className="section-eyebrow">PROFILE STATUS</p>

          <h3>{healthStatus}</h3>

          <p>{healthStatusText}</p>

        </div>

        <div className="health-status-progress">

          <div className="status-progress-top">
            <span>Profile completion</span>
            <strong>{profileCompletion}%</strong>
          </div>

          <div className="status-progress-bar">

            <div
              className="status-progress-fill"
              style={{ width: `${profileCompletion}%` }}
            ></div>

          </div>

        </div>

        <Link to="/profile" className="health-status-button">
          Update Profile →
        </Link>

      </section>

    </div>
  );
};

export default Dashboard;

