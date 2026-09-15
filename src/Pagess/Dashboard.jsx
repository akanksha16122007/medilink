import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";

const Dashboard = () => {
  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem("profile")) || {};
  });

  const [privacyMode, setPrivacyMode] = useState(false);
  const [copied, setCopied] = useState(false);

  /* =========================================
     LOAD PROFILE
  ========================================= */

  useEffect(() => {
    const updateProfile = () => {
      const savedProfile =
        JSON.parse(localStorage.getItem("profile")) || {};

      setProfile(savedProfile);
    };

    updateProfile();

    window.addEventListener("profileUpdated", updateProfile);

    return () => {
      window.removeEventListener(
        "profileUpdated",
        updateProfile
      );
    };
  }, []);

  /* =========================================
     LOAD RECORDS
  ========================================= */

  const savedRecords = localStorage.getItem("medilinkRecords");
  const records = savedRecords ? JSON.parse(savedRecords) : [];

  /* =========================================
     BASIC RECORD INSIGHTS
  ========================================= */

  const uniqueDoctors = new Set(
    records
      .map((record) => record.doctor)
      .filter(Boolean)
  ).size;

  const uniqueTypes = new Set(
    records
      .map((record) => record.type)
      .filter(Boolean)
  ).size;

  const recentRecords = records.slice(0, 3);

  /* =========================================
     MOST COMMON RECORD TYPE
  ========================================= */

  const recordTypeCount = {};

  records.forEach((record) => {
    if (record.type) {
      recordTypeCount[record.type] =
        (recordTypeCount[record.type] || 0) + 1;
    }
  });

  let mostCommonType = "No records yet";
  let highestCount = 0;

  Object.keys(recordTypeCount).forEach((type) => {
    if (recordTypeCount[type] > highestCount) {
      highestCount = recordTypeCount[type];
      mostCommonType = type;
    }
  });

  /* =========================================
     PROFILE COMPLETION
  ========================================= */

  const profileFields = [
    profile.name,
    profile.age,
    profile.bloodGroup,
    profile.phoneno,
    profile.allergies,
    profile.medical,
  ];

  const completedFields = profileFields.filter(
    (field) =>
      field &&
      field.toString().trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  /* =========================================
     DYNAMIC HEALTH STATUS
  ========================================= */

  let healthStatus = "";
  let healthStatusText = "";

  if (profileCompletion >= 76) {
    healthStatus = "Profile Ready";
    healthStatusText =
      "Your essential health information is mostly complete.";
  } else if (profileCompletion >= 41) {
    healthStatus = "Partially Complete";
    healthStatusText =
      "Add a few more details to complete your health profile.";
  } else {
    healthStatus = "Profile Incomplete";
    healthStatusText =
      "Complete your health profile to keep important information ready.";
  }

  /* =========================================
     PRIVACY MODE
  ========================================= */

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => !prev);
  };

  /* =========================================
     COPY HEALTH DETAILS
  ========================================= */

  const copyEmergencyDetails = () => {
    const emergencyText = `
MediLink Emergency Information

Blood Group: ${profile.bloodGroup || "Not added"}
Emergency Contact: ${profile.phoneno || "Not added"}
Allergies: ${profile.allergies || "None"}
Medical Conditions: ${profile.medical || "None"}
    `.trim();

    navigator.clipboard.writeText(emergencyText);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="dashboard">

      {/* =========================================
          HEALTH OVERVIEW
      ========================================= */}

      <section className="dashboard-overview">

        <div className="overview-heading">

          <p className="dashboard-eyebrow">
            HEALTH OVERVIEW
          </p>

          <h2>
            Good to see you,{" "}
            {profile.name || "User"}{" "}
            <span aria-hidden="true">
              👋
            </span>
          </h2>

          <p>
            Your important health information
            at a glance.
          </p>

        </div>

        <div className="overview-status">
          <span></span>
          Profile active
        </div>

      </section>


      {/* =========================================
          STATISTICS
      ========================================= */}

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


      {/* =========================================
          RECORDS + PRECAUTIONS
      ========================================= */}

      <div className="dashboard-main-grid">

        {/* HEALTH ACTIVITY */}

        <section className="activity-section">

          <div className="section-heading">

            <div>

              <p className="section-eyebrow">
                YOUR RECORDS
              </p>

              <h3>
                Health Activity
              </h3>

            </div>

            <Link
              to="/records"
              className="section-link"
            >
              All Records →
            </Link>

          </div>


          {recentRecords.length > 0 ? (

            <div className="activity-list">

              {recentRecords.map((record) => (

                <div
                  className="activity-item"
                  key={record.id}
                >

                  <div className="activity-marker">
                    <span></span>
                  </div>

                  <div className="activity-content">

                    <div className="activity-top">

                      <h4>
                        {record.type}
                      </h4>

                      <span>
                        {record.date}
                      </span>

                    </div>

                    <p>
                      Dr.{" "}
                      {record.doctor ||
                        "Not specified"}
                    </p>

                    {record.notes && (
                      <small>
                        {record.notes}
                      </small>
                    )}

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

              <span aria-hidden="true">
                📄
              </span>

              <div>

                <h4>
                  No health activity yet
                </h4>

                <p>
                  Your recent medical
                  records will appear here.
                </p>

              </div>

              <Link to="/records">
                Add Record →
              </Link>

            </div>

          )}

        </section>


        {/* MEDICAL PRECAUTIONS */}

        <section className="environment-section">

          <div className="environment-header">

            <div>

              <p className="section-eyebrow">
                HEALTH & SAFETY
              </p>

              <h3>
                Medical Precautions
              </h3>

            </div>

          </div>


          <div className="precautions-grid">

            <div className="precaution-item">
              <div className="precaution-icon">
                ✓
              </div>

              <div>
                <h4>
                  Keep Records Updated
                </h4>

                <p>
                  Keep your latest health records up to date.
                </p>
              </div>
            </div>


            <div className="precaution-item">
              <div className="precaution-icon">
                ✓
              </div>

              <div>
                <h4>
                  Keep Allergies Updated
                </h4>

                <p>
                  Mention known allergies clearly in your profile.
                </p>
              </div>
            </div>


            <div className="precaution-item">
              <div className="precaution-icon">
                ✓
              </div>

              <div>
                <h4>
                  Follow Prescribed Medicines
                </h4>

                <p>
                  Take medicines only as directed by your provider.
                </p>
              </div>
            </div>


            <div className="precaution-item">
              <div className="precaution-icon">
                ✓
              </div>

              <div>
                <h4>
                  Keep Emergency Details Ready
                </h4>

                <p>
                  Keep blood group and emergency contact updated.
                </p>
              </div>
            </div>

          </div>


          <div className="environment-footer">
            General health and safety guidance
          </div>

        </section>

      </div>


      {/* =========================================
          SMART HEALTH SNAPSHOT
      ========================================= */}

      <section className="smart-health-card">

        <div className="smart-health-header">

          <div className="smart-health-title">

            <div className="smart-health-icon">
              🩺
            </div>

            <div>

              <p className="section-eyebrow">
                QUICK ACCESS
              </p>

              <h3>
                Smart Health Snapshot
              </h3>

              <p>
                Important health details available
                when you need them.
              </p>

            </div>

          </div>


          <button
            className={`privacy-toggle ${
              privacyMode ? "active" : ""
            }`}
            onClick={togglePrivacyMode}
          >

            <span>
              {privacyMode ? "🔒" : "👁"}
            </span>

            {privacyMode
              ? "Privacy On"
              : "Privacy Mode"}

          </button>

        </div>


        {/* HEALTH DETAILS */}

        <div className="smart-health-details">

          <div className="health-detail-box">

            <span className="detail-icon">
              🩸
            </span>

            <div>

              <p>
                Blood Group
              </p>

              <strong
                className={
                  privacyMode
                    ? "privacy-hidden"
                    : ""
                }
              >
                {profile.bloodGroup ||
                  "Not added"}
              </strong>

            </div>

          </div>


          <div className="health-detail-box">

            <span className="detail-icon">
              ⚠️
            </span>

            <div>

              <p>
                Allergies
              </p>

              <strong
                className={
                  privacyMode
                    ? "privacy-hidden"
                    : ""
                }
              >
                {profile.allergies ||
                  "None"}
              </strong>

            </div>

          </div>


          <div className="health-detail-box">

            <span className="detail-icon">
              ☎
            </span>

            <div>

              <p>
                Emergency Contact
              </p>

              <strong
                className={
                  privacyMode
                    ? "privacy-hidden"
                    : ""
                }
              >
                {profile.phoneno ||
                  "Not added"}
              </strong>

            </div>

          </div>

        </div>


        {/* SNAPSHOT FOOTER */}

        <div className="smart-health-footer">

          <div className="snapshot-status">

            <span className="status-dot"></span>

            <span>
              Health information available
            </span>

          </div>


          <div className="snapshot-actions">

            <button
              className="copy-health-btn"
              onClick={copyEmergencyDetails}
            >
              {copied
                ? "✓ Copied!"
                : "Copy Details"}
            </button>

            <Link
              to="/profile"
              className="snapshot-profile-btn"
            >
              Open Profile →
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================
          RECORD INSIGHTS
      ========================================= */}

      <section className="record-insights">

        <div className="insights-heading">

          <div>

            <p className="section-eyebrow">
              YOUR HEALTH DATA
            </p>

            <h3>
              Medical Records Insights
            </h3>

            <p>
              A simple overview of your stored medical records.
            </p>

          </div>

          <div className="insights-icon">
            📊
          </div>

        </div>


        <div className="insights-grid">

          <div className="insight-box">

            <span className="insight-number">
              {records.length}
            </span>

            <span className="insight-label">
              Total Records
            </span>

          </div>


          <div className="insight-box">

            <span className="insight-number">
              {uniqueDoctors}
            </span>

            <span className="insight-label">
              Doctors
            </span>

          </div>


          <div className="insight-box">

            <span className="insight-number">
              {uniqueTypes}
            </span>

            <span className="insight-label">
              Record Types
            </span>

          </div>


          <div className="insight-box wide-insight">

            <span className="insight-small-label">
              MOST COMMON RECORD
            </span>

            <strong>
              {mostCommonType}
            </strong>

          </div>

        </div>


        {records.length > 0 && (

          <div className="record-type-bars">

            <div className="bars-heading">
              Record Type Distribution
            </div>

            {Object.entries(recordTypeCount).map(
              ([type, count]) => {

                const percentage =
                  (count / records.length) * 100;

                return (
                  <div
                    className="record-bar-row"
                    key={type}
                  >

                    <div className="record-bar-label">
                      <span>
                        {type}
                      </span>

                      <strong>
                        {count}
                      </strong>
                    </div>

                    <div className="record-bar">
                      <div
                        className="record-bar-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* =========================================
          HEALTH PROFILE STATUS
      ========================================= */}

      <section className="health-status-card">

        <div className="health-status-icon">
          {profileCompletion >= 76
            ? "✓"
            : "!"}
        </div>

        <div className="health-status-content">

          <p className="section-eyebrow">
            PROFILE STATUS
          </p>

          <h3>
            {healthStatus}
          </h3>

          <p>
            {healthStatusText}
          </p>

        </div>


        <div className="health-status-progress">

          <div className="status-progress-top">

            <span>
              Profile completion
            </span>

            <strong>
              {profileCompletion}%
            </strong>

          </div>

          <div className="status-progress-bar">

            <div
              className="status-progress-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

        </div>


        <Link
          to="/profile"
          className="health-status-button"
        >
          Update Profile →
        </Link>

      </section>

    </div>
  );
};

export default Dashboard;