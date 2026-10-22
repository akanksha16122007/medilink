import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCode from "react-qr-code";
import {faPlus,faXmark,faPenToSquare,faTrashCan,faClock,faPills,faBell,faCapsules,faFileMedical,faCalendarCheck,faShieldHalved,faHospital,faUserCheck} from "@fortawesome/free-solid-svg-icons";

  const createEmptyDoseTime = () => ({
  hour: "",
  minute: "",
  period: "AM",
});

const parseDoseTime = (time = "") => {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (match) {
    return {
      hour: String(Number(match[1])),
      minute: match[2],
      period: match[3].toUpperCase(),
    };
  }

  // Purane saved values jaise "16:15" ko bhi edit ke liye convert karta hai.
  const oldFormat = time.match(/^(\d{1,2}):(\d{2})$/);

  if (oldFormat) {
    const hour24 = Number(oldFormat[1]);

    return {
      hour: String(hour24 % 12 || 12),
      minute: oldFormat[2],
      period: hour24 >= 12 ? "PM" : "AM",
    };
  }

  return createEmptyDoseTime();
};
const getAppointmentDateTime = (appointment) => {
  if (!appointment?.date || !appointment?.time) return null;

  const date = new Date(`${appointment.date}T00:00:00`);
  const match = appointment.time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

  if (!match || Number.isNaN(date.getTime())) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  if (hour > 23 || minute > 59) return null;

  date.setHours(hour, minute, 0, 0);
  return date;
};
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const latDifference = toRadians(lat2 - lat1);
  const lonDifference = toRadians(lon2 - lon1);

  const value =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(lonDifference / 2) ** 2;

  return (
    earthRadiusKm *
    2 *
    Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
  );
};
const readLocalStorageObject = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

// Profile form kuch values arrays mein save karta hai,
// isliye array aur string dono handle honge.
const getStoredValue = (value) =>
  Array.isArray(value) ? value[0] : value;

const isProfileValueAdded = (value) => {
  const cleanValue = getStoredValue(value);

  return (
    cleanValue != null &&
    String(cleanValue).trim() !== "" &&
    String(cleanValue).trim().toLowerCase() !== "not added"
  );
};

const firstAddedValue = (...values) =>
  values.map(getStoredValue).find(isProfileValueAdded) || "";

const readDashboardProfileStatus = () => {
  const personalInfo = readLocalStorageObject("personalInfo");
  const legacyPersonalDetails = readLocalStorageObject("personalDetails");
  const medicalInfo = readLocalStorageObject("medicalInfo");
  const emergencyInfo = readLocalStorageObject("emergencyInfo");

  const personalFields = [
    firstAddedValue(personalInfo.name, legacyPersonalDetails.name),
    personalInfo.dob,
    firstAddedValue(personalInfo.gender, legacyPersonalDetails.gender),
    personalInfo.phoneno,
    personalInfo.email,
  ];

  const medicalFields = [
    medicalInfo.bloodGroup,
    medicalInfo.allergies,
    medicalInfo.chronicConditions,
  ];

  const completedFields = [...personalFields, ...medicalFields].filter(
    isProfileValueAdded
  ).length;

  const totalFields = personalFields.length + medicalFields.length;

  const emergencyContactAdded = [
    emergencyInfo.name,
    emergencyInfo.phone,
    emergencyInfo.relation,
  ].every(isProfileValueAdded);

  return {
    name:
      firstAddedValue(personalInfo.name, legacyPersonalDetails.name) ||
      "User",
    percent: Math.round((completedFields / totalFields) * 100),
    personalCompleted: personalFields.filter(isProfileValueAdded).length,
    medicalCompleted: medicalFields.filter(isProfileValueAdded).length,
    emergencyContactAdded,
  };
};
const Dashboard = () => {
 const [profileStatus, setProfileStatus] = useState(
  readDashboardProfileStatus
);

  const [records] = useState(
    JSON.parse(localStorage.getItem("medilinkRecords")) || []
  );

  const [appointments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("appointments")) || [];
    } catch {
      return [];
    }
  });

  const [insurancePolicies] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("medilinkHealthPolicy")
      );

      if (Array.isArray(saved)) return saved;
      return saved ? [saved] : [];
    } catch {
      return [];
    }
  });

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [selectedFacilityType, setSelectedFacilityType] = useState("All");
  const [manualLocation, setManualLocation] = useState("");
  const [nearbyLocationLabel, setNearbyLocationLabel] = useState("");
  const [medications, setMedications] = useState(() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("medilinkCurrentMedications")
    );
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
});

const [showMedicationModal, setShowMedicationModal] = useState(false);
const [editingMedicationId, setEditingMedicationId] = useState(null);
const [medicationForm, setMedicationForm] = useState({
  name: "",
  dosage: "",
  times: [createEmptyDoseTime()],
  reminderEnabled: false,
});
const [showEmergencyIdModal, setShowEmergencyIdModal] = useState(false);

const handleDownloadEmergencyQR = () => {
  const svg = document.querySelector(".emergency-id-modal-qr svg");
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 300;
    canvas.height = 300;
    context.drawImage(image, 0, 0, 300, 300);

    const downloadLink = document.createElement("a");
    downloadLink.download = "Emergency-Health-ID-QR.png";
    downloadLink.href = canvas.toDataURL("image/png");
    downloadLink.click();
  };

  image.src =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
};

const handlePrintEmergencyId = () => {
  window.open(
    `${window.location.origin}/emergency-id?print=true`,
    "_blank",
    "noopener,noreferrer"
  );
};

useEffect(() => {
  const refreshProfileStatus = () => {
    setProfileStatus(readDashboardProfileStatus());
  };

  refreshProfileStatus();

  window.addEventListener("focus", refreshProfileStatus);
  window.addEventListener("storage", refreshProfileStatus);

  return () => {
    window.removeEventListener("focus", refreshProfileStatus);
    window.removeEventListener("storage", refreshProfileStatus);
  };
}, []);
  useEffect(() => {
    localStorage.setItem(
      "medilinkCurrentMedications",
      JSON.stringify(medications)
    );
  }, [medications]);

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const now = new Date();

  const allUpcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDateTime = getAppointmentDateTime(appointment);
      return appointmentDateTime && appointmentDateTime >= now;
    })
    .sort(
      (a, b) =>
        getAppointmentDateTime(a) - getAppointmentDateTime(b)
    );

  const upcomingAppointments = allUpcomingAppointments.slice(0, 3);

  const policyStatus = (expiryDate) => {
    if (!expiryDate) return "Date needed";

    const todayISO = new Date().toISOString().slice(0, 10);
    return expiryDate >= todayISO ? "Active" : "Expired";
  };

  const searchNearbyFacilitiesAt = async (latitude, longitude) => {
  setUserCoordinates({ latitude, longitude });

  try {
    const query = `
      [out:json][timeout:25];
      (
        nwr["amenity"~"hospital|clinic|pharmacy"]
          (around:5000,${latitude},${longitude});
      );
      out center tags;
    `;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ data: query }),
      }
    );

    if (!response.ok) {
      throw new Error("Nearby healthcare search failed.");
    }

    const data = await response.json();

    const places = (data.elements || [])
      .map((place) => {
        const placeLatitude = place.lat ?? place.center?.lat;
        const placeLongitude = place.lon ?? place.center?.lon;

        if (placeLatitude == null || placeLongitude == null) {
          return null;
        }

        const amenity = place.tags?.amenity;
        const type =
          amenity === "pharmacy"
            ? "Pharmacy"
            : amenity === "clinic"
              ? "Clinic"
              : "Hospital";

        return {
          id: `${place.type}-${place.id}`,
          name: place.tags?.name || `Nearby ${type}`,
          type,
          latitude: placeLatitude,
          longitude: placeLongitude,
          distance: calculateDistanceKm(
            latitude,
            longitude,
            placeLatitude,
            placeLongitude
          ),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance);

    setNearbyPlaces(places);

    if (!places.length) {
      setNearbyError(
        "No hospitals, clinics, or pharmacies were found within 5 km."
      );
    }
  } catch {
    setNearbyError("Could not load nearby healthcare. Please try again.");
  }
};

const detectNearbyHospitals = () => {
  setNearbyError("");
  setNearbyPlaces([]);
  setNearbyLocationLabel("your current location");

  if (!navigator.geolocation) {
    setNearbyLocationLabel("");
    setNearbyError("Location detection is not supported by this browser.");
    return;
  }

  setNearbyLoading(true);

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      await searchNearbyFacilitiesAt(coords.latitude, coords.longitude);
      setNearbyLoading(false);
    },
    () => {
      setNearbyLoading(false);
      setNearbyLocationLabel("");
      setNearbyError("Allow location access to find nearby healthcare.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

const searchManualLocation = async (event) => {
  event.preventDefault();

  const locationQuery = manualLocation.trim();
  if (!locationQuery) return;

  setNearbyError("");
  setNearbyPlaces([]);
  setNearbyLoading(true);

  try {
    const params = new URLSearchParams({
      q: locationQuery,
      format: "jsonv2",
      limit: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Location lookup failed.");
    }

    const matches = await response.json();
    const match = matches[0];

    if (!match) {
      setNearbyLocationLabel("");
      setNearbyError(
        "Location not found. Try an area or city."
      );
      return;
    }

    const latitude = Number(match.lat);
    const longitude = Number(match.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Invalid location coordinates.");
    }

    setNearbyLocationLabel(locationQuery);
    await searchNearbyFacilitiesAt(latitude, longitude);
  } catch {
    setNearbyLocationLabel("");
    setNearbyError(
      "Could not find this location. Try an area or city."
    );
  } finally {
    setNearbyLoading(false);
  }
};
  const resetNearbySearch = () => {
  setNearbyPlaces([]);
  setNearbyError("");
  setUserCoordinates(null);
  setSelectedFacilityType("All");
  setManualLocation("");
  setNearbyLocationLabel("");
};

  const formatDistance = (distance) =>
    distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;

  const visibleNearbyPlaces = nearbyPlaces
    .filter(
      (place) =>
        selectedFacilityType === "All" ||
        place.type === selectedFacilityType
    )
    .slice(0, 6);

  const openDirections = (place) => {
    if (!userCoordinates) return;

    const directionsUrl =
      `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
      `${userCoordinates.latitude}%2C${userCoordinates.longitude}%3B` +
      `${place.latitude}%2C${place.longitude}`;

    window.open(directionsUrl, "_blank", "noopener,noreferrer");
  };
  const openAddMedication = () => {
  setEditingMedicationId(null);
  setMedicationForm({
    name: "",
    dosage: "",
    times: [createEmptyDoseTime()],
    reminderEnabled: false,
  });
  setShowMedicationModal(true);
  };

  const openEditMedication = (medication) => {
    setEditingMedicationId(medication.id);
    setMedicationForm({
      name: medication.name || "",
      dosage: medication.dosage || "",
      times: medication.times?.length
        ? medication.times.map(parseDoseTime)
        : [createEmptyDoseTime()],
      reminderEnabled: Boolean(medication.reminderEnabled),
    });
    setShowMedicationModal(true);
  };

  const updateMedicationForm = (event) => {
    const { name, value } = event.target;

    setMedicationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

const updateMedicationTime = (index, field, value) => {
  setMedicationForm((previous) => ({
    ...previous,
    times: previous.times.map((time, timeIndex) =>
      timeIndex === index
        ? { ...time, [field]: value }
        : time
    ),
  }));
};

const addMedicationTime = () => {
  setMedicationForm((previous) => ({
    ...previous,
    times: [...previous.times, createEmptyDoseTime()],
  }));
};

const removeMedicationTime = (index) => {
  setMedicationForm((previous) => {
    const remainingTimes = previous.times.filter(
      (_, timeIndex) => timeIndex !== index
    );

    return {
      ...previous,
      times: remainingTimes.length
        ? remainingTimes
        : [createEmptyDoseTime()],
    };
  });
};

  const handleSaveMedication = (event) => {
        event.preventDefault();

        const selectedTimes = medicationForm.times
          .filter((time) => time.hour && time.minute)
          .map(
            (time) =>
              `${time.hour.padStart(2, "0")}:${time.minute} ${time.period}`
          );

        if (!selectedTimes.length) return;

        const medicationData = {
          id: editingMedicationId || Date.now(),
          name: medicationForm.name.trim(),
          dosage: medicationForm.dosage.trim(),
          times: selectedTimes,
          reminderEnabled: medicationForm.reminderEnabled,
        };

        setMedications((previous) =>
          editingMedicationId
            ? previous.map((medication) =>
                medication.id === editingMedicationId
                  ? medicationData
                  : medication
              )
            : [medicationData, ...previous]
        );

        setShowMedicationModal(false);
        setEditingMedicationId(null);
        setMedicationForm({
          name: "",
          dosage: "",
          times: [createEmptyDoseTime()],
          reminderEnabled: false,
        });
      };
      const handleDeleteMedication = (id) => {
        const confirmed = window.confirm(
          "Remove this medication from your current list?"
        );

        if (!confirmed) return;

        setMedications((previous) =>
          previous.filter((medication) => medication.id !== id)
        );
      };
  return (
    <div className="dashboard">
      <section className="dashboard-overview">
        <div className="overview-heading">
          <p className="dashboard-eyebrow">HEALTH OVERVIEW</p>

          <h2>
            Good to see you, {profileStatus.name} <span>👋</span>
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
          icon="🗓️"
          number={allUpcomingAppointments.length}
          title="Upcoming Appointments"
          variant="prescriptions"
        />

        <StatCard
          icon="💊"
          number={medications.length}
          title="Current Medications"
          variant="prescriptions"
        />
      </div>
      <section className="dashboard-panel emergency-quick-access">
  <div>
    <p className="section-eyebrow">EMERGENCY ACCESS</p>
    <h3>Emergency Health ID</h3>
    <p>Open your QR code and essential emergency health information.</p>
  </div>

  <button
    type="button"
    className="emergency-id-open-button"
    onClick={() => setShowEmergencyIdModal(true)}
  >
    <i className="fa-solid fa-qrcode" aria-hidden="true" />
    Emergency Health ID
  </button>
</section>
      <div className="dashboard-main-grid">
        <div className="dashboard-left-column">
          <section className="dashboard-panel current-medications-panel">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">TREATMENT PLAN</p>

                <h3><FontAwesomeIcon
                  icon={faCapsules}
                  className="dashboard-section-icon"
                  aria-hidden="true"
                />Current Medications</h3>
              </div>

              <button
                type="button"
                className="medication-add-button"
                onClick={openAddMedication}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add medication</span>
              </button>
            </div>

            {medications.length ? (
              <div className="medication-list">
                {medications.map((medication) => (
                  <article className="medication-item" key={medication.id}>
                    <div className="medication-item-info">
                      <h4>
                        <FontAwesomeIcon icon={faPills} />
                        {medication.name}
                      </h4>

                      <p>Dosage: {medication.dosage}</p>

                      <div className="medication-dose-times">
                        <span>
                        Dose time{medication.times.length > 1 ? "s" : ""}:
                      </span>

                        {medication.times.map((time, index) => (
                          <span className="medication-time-chip" key={`${time}-${index}`}>
                            <FontAwesomeIcon icon={faClock} />
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="medication-item-actions">
                      <button
                        type="button"
                        className="medication-edit-button"
                        onClick={() => openEditMedication(medication)}
                        aria-label={`Edit ${medication.name}`}
                        title="Edit medication"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="medication-delete-button"
                        onClick={() => handleDeleteMedication(medication.id)}
                        aria-label={`Remove ${medication.name}`}
                        title="Remove medication"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="medication-empty">
                <span className="medication-empty-icon">
                  <FontAwesomeIcon icon={faPills} />
                </span>

                <h4>No current medications added</h4>
                <p>Add medicines currently prescribed by your doctor.</p>

                <button
                  type="button"
                  className="medication-add-button"
                  onClick={openAddMedication}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add medication</span>
                </button>
              </div>
            )}
          </section>

          <section className="dashboard-panel activity-section">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">YOUR RECORDS</p>

                <h3><FontAwesomeIcon
                  icon={faFileMedical}
                  className="dashboard-section-icon"
                  aria-hidden="true"
                />Recent Medical Records</h3>
              </div>

              <Link to="/records" className="section-link">
                All Records →
              </Link>
            </div>

            {recentRecords.length ? (
              <div className="activity-list">
                {recentRecords.map((record) => (
                  <div className="activity-item" key={record.id}>
                    <div className="activity-marker">
                      <span></span>
                    </div>

                    <div className="activity-content">
                      <div className="activity-top">
                        <h4>{record.type}</h4>
                        <span>{record.date}</span>
                      </div>

                      <p>Dr. {record.doctor || "Not specified"}</p>

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
        </div>

        <div className="dashboard-right-column">
          <section className="dashboard-panel">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">SCHEDULE</p>

                <h3><FontAwesomeIcon
                  icon={faCalendarCheck}
                  className="dashboard-section-icon"
                  aria-hidden="true"
                />Upcoming Appointments</h3>
              </div>

              <Link to="/AppointmentPlanner" className="section-link">
                View all →
              </Link>
            </div>

            {upcomingAppointments.length ? (
              <div className="dashboard-appointment-list">
                {upcomingAppointments.map((appointment) => (
                  <div
                    className="dashboard-appointment-item"
                    key={appointment.id}
                  >
                    <strong>{appointment.doctor}</strong>
                    <span>{appointment.specialist}</span>
                    <small>
                      {appointment.date} · {appointment.time}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard-empty-message">
                No upcoming appointments.
              </p>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">COVERAGE</p>

                <h3><FontAwesomeIcon
                  icon={faShieldHalved}
                  className="dashboard-section-icon"
                  aria-hidden="true"
                />Health Insurance</h3>
              </div>

              <Link to="/HealthInsurance" className="section-link">
                View policies →
              </Link>
            </div>

            {insurancePolicies.length ? (
              <div className="dashboard-policy-list">
                {insurancePolicies.slice(0, 3).map((policy, index) => (
                  <div
                    className="dashboard-policy-item"
                    key={policy.id || index}
                  >
                    <strong>{policy.provider || "Insurance policy"}</strong>
                    <span>
                      {policy.expiryDate
                        ? `${policyStatus(policy.expiryDate)} · Expires ${policy.expiryDate}`
                        : "Expiry date not added"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard-empty-message">
                No health insurance policies added.
              </p>
            )}
          </section>


        </div>
      </div>

      <section className="dashboard-panel nearby-healthcare-panel">
        <div className="nearby-healthcare-heading">
          <div>
            <p className="section-eyebrow">LOCATION BASED</p>

            <h3><FontAwesomeIcon
              icon={faHospital}
              className="dashboard-section-icon"
              aria-hidden="true"
            />Nearby Healthcare</h3>
            <p>Find hospitals, clinics, and pharmacies near you.</p>
          </div>

          <div className="nearby-header-actions">
            <button
              className="nearby-location-button"
              type="button"
              onClick={detectNearbyHospitals}
              disabled={nearbyLoading}
            >
              {nearbyLoading ? "Finding nearby care…" : "Use my location"}
            </button>

            {!nearbyLoading && (nearbyPlaces.length > 0 || nearbyError) && (
              <button
                className="nearby-reset-button"
                type="button"
                onClick={resetNearbySearch}
              >
                Reset search
              </button>
            )}
          </div>
        </div>
        <form
          className="nearby-manual-search"
          onSubmit={searchManualLocation}
        >
          <label htmlFor="nearby-manual-location">
            Enter your location manually
          </label>

          <div className="nearby-manual-search-row">
            <input
              id="nearby-manual-location"
              type="text"
              value={manualLocation}
              onChange={(event) => setManualLocation(event.target.value)}
              placeholder="Area or city"
              autoComplete="off"
            />

            <button
              type="submit"
              className="nearby-location-button"
              disabled={nearbyLoading || !manualLocation.trim()}
            >
              {nearbyLoading ? "Searching…" : "Search this area"}
            </button>
          </div>
        </form>

        <div className="nearby-type-filters" aria-label="Filter by facility type">
          {["All", "Hospital", "Clinic", "Pharmacy"].map((type) => (
            <button
              key={type}
              type="button"
              className={
                selectedFacilityType === type
                  ? "nearby-filter-button is-selected"
                  : "nearby-filter-button"
              }
              aria-pressed={selectedFacilityType === type}
              onClick={() => setSelectedFacilityType(type)}
            >
              {{
            All: "All types",
            Hospital: "Hospitals",
            Clinic: "Clinics",
            Pharmacy: "Pharmacies",
          }[type]}
            </button>
          ))}
        </div>
        {nearbyLocationLabel && (
          <p className="nearby-status">
            Showing results near {nearbyLocationLabel} — within 5 km.
          </p>
        )}
        {nearbyLoading ? (
          <p className="nearby-status" role="status">
            Finding nearby healthcare facilities…
          </p>
        ) : nearbyError ? (
          <p className="nearby-status" role="status">
            {nearbyError}
          </p>
        ) : nearbyPlaces.length === 0 ? (
          <p className="nearby-status">
            Select a facility type, then use your location or enter an area or city to search within 5 km.
          </p>
        ) : visibleNearbyPlaces.length > 0 ? (
          <div className="nearby-list">
            {visibleNearbyPlaces.map((place) => (
              <article className="nearby-item" key={place.id}>
                <span className="nearby-place-icon" aria-hidden="true">
                  {place.type === "Pharmacy" ? "💊" : "🏥"}
                </span>

                <div className="nearby-place-info">
                  <h4>{place.name}</h4>
                  <span className="nearby-type-label">{place.type}</span>
                </div>

                <div className="nearby-card-meta">
                  <span className="nearby-distance">
                    {formatDistance(place.distance)}
                  </span>

                  <button
                    className="nearby-directions-button"
                    type="button"
                    onClick={() => openDirections(place)}
                  >
                    Get directions
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="nearby-status">
            No {selectedFacilityType.toLowerCase()} results found within 5 km.
          </p>
        )}
      </section>
      <section className="dashboard-panel profile-status-panel">
        <div className="section-heading profile-status-heading">
          <div>
            <p className="section-eyebrow">YOUR PROFILE</p>

            <h3><FontAwesomeIcon icon={faUserCheck} className="dashboard-section-icon" aria-hidden="true" />Profile Status</h3>
          </div>

          <strong>{profileStatus.percent}% complete</strong>
        </div>

        <div
          className="profile-progress-track"
          role="progressbar"
          aria-label="Profile completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profileStatus.percent}
        >
          <span style={{ width: `${profileStatus.percent}%` }} />
        </div>

        <div className="profile-status-details">
          <p>
            Personal details
            <span>{profileStatus.personalCompleted}/5 added</span>
          </p>

          <p>
            Medical details
            <span>{profileStatus.medicalCompleted}/3 added</span>
          </p>

          <p>
            Emergency contact
            <span>
              {profileStatus.emergencyContactAdded ? "Added" : "Not added"}
            </span>
          </p>
        </div>

        <Link to="/profile" className="section-link">
          View profile →
        </Link>
      </section>
      {showEmergencyIdModal && (
  <div
    className="emergency-id-modal-overlay"
    onClick={() => setShowEmergencyIdModal(false)}
  >
    <section
      className="emergency-id-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-id-modal-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="emergency-id-modal-header">
        <div>
          <p className="section-eyebrow">EMERGENCY ACCESS</p>
          <h3 id="emergency-id-modal-title">Emergency Health ID</h3>
        </div>

        <button
          type="button"
          className="emergency-id-modal-close"
          onClick={() => setShowEmergencyIdModal(false)}
          aria-label="Close Emergency Health ID"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>

      <p className="emergency-id-modal-description">
        Scan this QR code to open your Emergency Health ID.
      </p>

      <div className="emergency-id-modal-qr">
        <QRCode
          size={200}
          value={`${window.location.origin}/emergency-id`}
        />
      </div>

      <div className="emergency-id-modal-actions">
        <button type="button" onClick={handlePrintEmergencyId}>
          <i className="fa-solid fa-print" aria-hidden="true" />
          Print ID
        </button>

        <button type="button" onClick={handleDownloadEmergencyQR}>
          <i className="fa-solid fa-download" aria-hidden="true" />
          Download QR
        </button>
      </div>
    </section>
  </div>
)}
      {showMedicationModal && (
        <div className="medication-modal-overlay">
          <section
            className="medication-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="medication-modal-title"
          >
            <div className="medication-modal-header">
              <div>
                <p className="section-eyebrow">TREATMENT PLAN</p>
                <h3 id="medication-modal-title">
                  {editingMedicationId ? "Edit medication" : "Add medication"}
                </h3>
              </div>

             <button
                type="button"
                className="medication-modal-close"
                onClick={() => setShowMedicationModal(false)}
                aria-label="Close medication form"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSaveMedication}>
              <label htmlFor="medication-name">Medicine name</label>
              <input
                id="medication-name"
                name="name"
                type="text"
                value={medicationForm.name}
                onChange={updateMedicationForm}
                placeholder="e.g. Medicine name"
                required
              />

              <label htmlFor="medication-dosage">Dosage</label>
              <input
                id="medication-dosage"
                name="dosage"
                type="text"
                value={medicationForm.dosage}
                onChange={updateMedicationForm}
                placeholder="e.g. 500 mg"
                required
              />

              <fieldset className="medication-times">
                <legend>
                  Dose time{medicationForm.times.length > 1 ? "s" : ""}
                </legend>

                {medicationForm.times.map((time, index) => (
                  <div className="medication-time-row" key={index}>
                    <span className="medication-dose-label">
                      Dose {index + 1}
                    </span>

                    <select
                      value={time.hour}
                      onChange={(event) =>
                        updateMedicationTime(index, "hour", event.target.value)
                      }
                      required
                      aria-label={`Dose ${index + 1} hour`}
                    >
                      <option value="" disabled>Hour</option>
                      {Array.from({ length: 12 }, (_, hourIndex) => {
                        const hour = String(hourIndex + 1);
                        return <option key={hour} value={hour}>{hour}</option>;
                      })}
                    </select>

                    <select
                      value={time.minute}
                      onChange={(event) =>
                        updateMedicationTime(index, "minute", event.target.value)
                      }
                      required
                      aria-label={`Dose ${index + 1} minute`}
                    >
                      <option value="" disabled>Minute</option>
                      {Array.from({ length: 60 }, (_, minuteIndex) => {
                        const minute = String(minuteIndex).padStart(2, "0");
                        return <option key={minute} value={minute}>{minute}</option>;
                      })}
                    </select>

                    <select
                      value={time.period}
                      onChange={(event) =>
                        updateMedicationTime(index, "period", event.target.value)
                      }
                      aria-label={`Dose ${index + 1} AM or PM`}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>

                    {medicationForm.times.length > 1 && (
                      <button
                        type="button"
                        className="medication-time-remove"
                        onClick={() => removeMedicationTime(index)}
                        aria-label={`Remove dose ${index + 1}`}
                        title="Remove dose time"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="medication-add-time-button"
                  onClick={addMedicationTime}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add dose time</span>
                </button>
              </fieldset>
              <label className="medication-reminder-toggle">
                <input
                  type="checkbox"
                  checked={medicationForm.reminderEnabled}
                  onChange={(event) =>
                    setMedicationForm((previous) => ({
                      ...previous,
                      reminderEnabled: event.target.checked,
                    }))
                  }
                />

                <span>
                  <FontAwesomeIcon icon={faBell} />
                  Enable reminders for this medicine
                </span>
              </label>

              <div className="medication-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowMedicationModal(false)}
                >
                  Cancel
                </button>

                <button type="submit">
                  {editingMedicationId ? "Save changes" : "Save medication"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};


export default Dashboard;