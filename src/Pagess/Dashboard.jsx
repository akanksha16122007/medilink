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

  const [location, setLocation] = useState({
    latitude: 30.7333,
    longitude: 76.7794,
    name: "Chandigarh",
    isUserLocation: false,
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  /* =========================================
     HEALTH ENVIRONMENT
  ========================================= */

  const [environment, setEnvironment] = useState(null);
  const [environmentLoading, setEnvironmentLoading] = useState(true);
  const [environmentError, setEnvironmentError] = useState("");

  /* =========================================
     NEARBY HEALTHCARE
  ========================================= */

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(true);
  const [nearbyError, setNearbyError] = useState("");

  /* =========================================
     USE MY LOCATION
  ========================================= */

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser."
      );
      return;
    }

    setLocationLoading(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          name: "Your location",
          isUserLocation: true,
        });

        setLocationLoading(false);
      },

      () => {
        setLocationLoading(false);

        setLocationMessage(
          "Unable to access your location. Showing Chandigarh data."
        );
      }
    );
  };

  /* =========================================
     HEALTH ENVIRONMENT API
     OPEN-METEO
  ========================================= */

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        setEnvironmentLoading(true);
        setEnvironmentError("");

        const response = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,pm2_5,uv_index&timezone=auto`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch environment data.");
        }

        const data = await response.json();

        setEnvironment({
          aqi: data.current?.us_aqi ?? "—",
          pm25: data.current?.pm2_5 ?? "—",
          uv: data.current?.uv_index ?? "—",
        });
      } catch (error) {
        setEnvironmentError(
          "Environment data is currently unavailable."
        );
      } finally {
        setEnvironmentLoading(false);
      }
    };

    fetchEnvironmentData();
  }, [location]);

  /* =========================================
     AQI STATUS
  ========================================= */

  const getAqiStatus = (aqi) => {
    if (aqi === "—") return "Unavailable";

    if (aqi <= 50) return "Good";

    if (aqi <= 100) return "Moderate";

    if (aqi <= 150)
      return "Unhealthy for sensitive groups";

    if (aqi <= 200) return "Unhealthy";

    if (aqi <= 300) return "Very unhealthy";

    return "Hazardous";
  };

  /* =========================================
     HAVERSINE DISTANCE
  ========================================= */

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const earthRadius = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };

  /* =========================================
     OPENSTREETMAP + OVERPASS
  ========================================= */

  useEffect(() => {
    const fetchNearbyHealthcare = async () => {
      try {
        setNearbyLoading(true);
        setNearbyError("");

        const query = `
          [out:json];
          (
            nwr["amenity"="hospital"](around:5000,${location.latitude},${location.longitude});
            nwr["amenity"="pharmacy"](around:5000,${location.latitude},${location.longitude});
          );
          out center tags;
        `;

        const response = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to fetch nearby healthcare facilities."
          );
        }

        const data = await response.json();

        const places = data.elements
          .map((place) => {
            const latitude =
              place.lat ?? place.center?.lat;

            const longitude =
              place.lon ?? place.center?.lon;

            if (!latitude || !longitude) {
              return null;
            }

            const type =
              place.tags?.amenity === "pharmacy"
                ? "Pharmacy"
                : "Hospital";

            const name =
              place.tags?.name ||
              (type === "Pharmacy"
                ? "Nearby Pharmacy"
                : "Nearby Hospital");

            const distance =
              calculateDistance(
                location.latitude,
                location.longitude,
                latitude,
                longitude
              );

            return {
              id: place.id,
              name,
              type,
              latitude,
              longitude,
              distance,
            };
          })
          .filter(Boolean)
          .sort(
            (a, b) =>
              a.distance - b.distance
          );

        const hospitals = places
          .filter(
            (place) =>
              place.type === "Hospital"
          )
          .slice(0, 2);

        const pharmacies = places
          .filter(
            (place) =>
              place.type === "Pharmacy"
          )
          .slice(0, 2);

        const selectedPlaces = [
          ...hospitals,
          ...pharmacies,
        ]
          .sort(
            (a, b) =>
              a.distance - b.distance
          )
          .slice(0, 4);

        setNearbyPlaces(selectedPlaces);
      } catch (error) {
        setNearbyError(
          "Nearby healthcare information is currently unavailable."
        );
      } finally {
        setNearbyLoading(false);
      }
    };

    fetchNearbyHealthcare();
  }, [location]);

  /* =========================================
     DIRECTIONS
  ========================================= */

  const openDirections = (place) => {
    const url =
      `https://www.openstreetmap.org/directions?` +
      `engine=fossgis_osrm_car&route=` +
      `${location.latitude}%2C${location.longitude}%3B` +
      `${place.latitude}%2C${place.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================
     FORMAT DISTANCE
  ========================================= */

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(
        distance * 1000
      )} m`;
    }

    return `${distance.toFixed(1)} km`;
  };

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


        {/* HEALTH ENVIRONMENT */}

        <section className="environment-section">

          <div className="environment-header">

            <div>

              <p className="section-eyebrow">
                LIVE DATA
              </p>

              <h3>
                Health Environment
              </h3>

            </div>

            <span className="live-indicator">

              <span></span>

              Live

            </span>

          </div>


          {/* SHARED LOCATION */}

          <div className="environment-location-row">

            <div className="environment-location">

              <span>
                📍
              </span>

              {location.name}

            </div>

            <button
              className="environment-location-button"
              onClick={
                handleUseMyLocation
              }
              disabled={locationLoading}
            >
              {locationLoading
                ? "Detecting..."
                : "Use my location"}
            </button>

          </div>


          {locationMessage && (

            <p className="location-message">
              {locationMessage}
            </p>

          )}


          {environmentLoading ? (

            <div className="environment-loading">

              <div className="loading-line"></div>

              <div className="loading-line short"></div>

              <p>
                Fetching environmental data...
              </p>

            </div>

          ) : environmentError ? (

            <div className="environment-error">
              {environmentError}
            </div>

          ) : (

            <>

              <div className="environment-metrics">

                <div className="environment-metric">

                  <span>
                    AQI
                  </span>

                  <strong>
                    {environment.aqi}
                  </strong>

                  <small>
                    {getAqiStatus(
                      environment.aqi
                    )}
                  </small>

                </div>


                <div className="environment-metric">

                  <span>
                    UV Index
                  </span>

                  <strong>
                    {environment.uv}
                  </strong>

                  <small>
                    Current level
                  </small>

                </div>


                <div className="environment-metric">

                  <span>
                    PM2.5
                  </span>

                  <strong>
                    {environment.pm25}
                  </strong>

                  <small>
                    μg/m³
                  </small>

                </div>

              </div>


              <div className="environment-footer">
                Environmental data powered by
                Open-Meteo
              </div>

            </>

          )}

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


        {/* NEARBY HEALTHCARE */}

        <div className="nearby-healthcare">

          <div className="nearby-header">

            <div>

              <p className="section-eyebrow">
                LOCATION BASED
              </p>

              <h4>
                Nearby Healthcare
              </h4>

              <span>
                Hospitals and pharmacies
                near{" "}
                {location.name.toLowerCase()}
              </span>

            </div>

            <button
              className="location-button"
              onClick={
                handleUseMyLocation
              }
              disabled={locationLoading}
            >
              {locationLoading
                ? "Detecting..."
                : "Use my location"}
            </button>

          </div>


          {nearbyLoading ? (

            <div className="nearby-loading">
              Finding nearby healthcare
              facilities...
            </div>

          ) : nearbyError ? (

            <div className="nearby-error">
              {nearbyError}
            </div>

          ) : nearbyPlaces.length > 0 ? (

            <div className="nearby-list">

              {nearbyPlaces.map(
                (place) => (

                  <div
                    className="nearby-item"
                    key={`${place.type}-${place.id}`}
                  >

                    <div className="nearby-place-icon">
                      {place.type ===
                      "Hospital"
                        ? "🏥"
                        : "💊"}
                    </div>


                    <div className="nearby-place-info">

                      <h5>
                        {place.name}
                      </h5>

                      <span>
                        {place.type}
                      </span>

                    </div>


                    <span className="nearby-distance">
                      {formatDistance(
                        place.distance
                      )}
                    </span>


                    <button
                      className="directions-button"
                      onClick={() =>
                        openDirections(place)
                      }
                    >
                      Get Directions
                    </button>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="nearby-error">
              No nearby healthcare
              facilities were found.
            </div>

          )}


          <p className="nearby-footer">
            Healthcare locations powered by
            OpenStreetMap.
          </p>

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