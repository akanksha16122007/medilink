import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";

const Dashboard = () => {
  const [profile, setProfile] = useState(() => {
  return JSON.parse(localStorage.getItem("profile")) || {};
});
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

  const savedRecords = localStorage.getItem("medilinkRecords");
  const records = savedRecords ? JSON.parse(savedRecords) : [];

  const uniqueDoctors = new Set(
    records.map((record) => record.doctor).filter(Boolean)
  ).size;

  const recentRecords = records.slice(0, 3);

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
    (field) => field && field.toString().trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  /* =========================================
     SHARED LOCATION
  ========================================= */

  /* =========================================
     NEARBY HEALTHCARE
  ========================================= */

  /* =========================================
     USE MY LOCATION
  ========================================= */


  /* =========================================
     HAVERSINE DISTANCE
  ========================================= */

  /* =========================================
     OPENSTREETMAP + OVERPASS
  ========================================= */

  /* =========================================
     DIRECTIONS
  ========================================= */




  return (
    <div className="dashboard">

      {/* HEALTH OVERVIEW */}

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


      {/* STATISTICS */}

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


      {/* ACTIVITY + ENVIRONMENT */}

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

              {recentRecords.map(
                (record) => (

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

                )
              )}

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
      <div className="precaution-icon">✓</div>
      <div>
        <h4>Keep Records Updated</h4>
        <p>Keep your latest health records up to date.</p>
      </div>
    </div>

    <div className="precaution-item">
      <div className="precaution-icon">✓</div>
      <div>
        <h4>Keep Allergies Updated</h4>
        <p>Mention known allergies clearly in your profile.</p>
      </div>
    </div>

    <div className="precaution-item">
      <div className="precaution-icon">✓</div>
      <div>
        <h4>Follow Prescribed Medicines</h4>
        <p>Take medicines only as directed by your provider.</p>
      </div>
    </div>

    <div className="precaution-item">
      <div className="precaution-icon">✓</div>
      <div>
        <h4>Keep Emergency Details Ready</h4>
        <p>Keep blood group and emergency contact updated.</p>
      </div>
    </div>

  </div>

  <div className="environment-footer">
    General health and safety guidance
  </div>

</section>

      </div>


      {/* EMERGENCY INFORMATION */}

      <section
        className="emergency-card"
        aria-labelledby="emergency-heading"
      >

        <div className="emergency-copy">

          <span
            className="emergency-icon"
            aria-hidden="true"
          >
            ✚
          </span>

          <div>

            <p className="emergency-label">
              IMPORTANT FOR URGENT CARE
            </p>

            <h3 id="emergency-heading">
              Emergency Information
            </h3>

            <p>
              Important details available
              when they are needed.
            </p>

          </div>

        </div>


        {/* EMERGENCY DETAILS */}

        <div className="emergency-details">

          <div>

            <span>
              Blood Group
            </span>

            <strong>
              {profile.bloodGroup ||
                "Not added"}
            </strong>

          </div>


          <div>

            <span>
              Emergency Contact
            </span>

            <strong>
              {profile.phoneno ||
                "Not added"}
            </strong>

          </div>


          <div>

            <span>
              Allergies
            </span>

            <strong>
              {profile.allergies ||
                "None"}
            </strong>

          </div>

        </div>



      </section>


      {/* PROFILE HEALTH CHECK */}

      <section className="profile-check">

        <div className="profile-check-info">

          <div className="profile-check-icon">
            ✓
          </div>

          <div>

            <p className="section-eyebrow">
              PROFILE STATUS
            </p>

            <h3>
              Health Profile
            </h3>

            <p>
              Keep your information complete
              and up to date.
            </p>

          </div>

        </div>


        <div className="profile-progress-area">

          <div className="profile-progress-top">

            <span>
              {completedFields} of{" "}
              {profileFields.length}{" "}
              details completed - 
            </span>

            <strong>
              {profileCompletion}%
            </strong>

          </div>

          <div className="profile-progress">

            <div
              className="profile-progress-fill"
              style={{
                width: `${profileCompletion}%`,
              }}
            ></div>

          </div>

        </div>


        {/* DIRECT PROFILE BUTTON */}

        <Link
          to="/profile"
          className="profile-check-button"
        >
          Open Profile →
        </Link>

      </section>

    </div>
  );
};

export default Dashboard;