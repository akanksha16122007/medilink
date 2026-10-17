import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, SetIsEditing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(() => {
    const savedDetails = localStorage.getItem("personalDetails");
    return savedDetails
      ? JSON.parse(savedDetails)
      : {
          name: "Akanksha Khurana",
          gender: "Female",
          age: "18 years",
          location: "Chandigarh,India",
        };
  });
  const [personalFormData, setPersonalFormData] = useState(personalDetails);
  useEffect(() => {
    localStorage.setItem("personalDetails", JSON.stringify(personalDetails));
  }, [personalDetails]);
  const handleChange = (e) => {
    setPersonalFormData({
      ...personalFormData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSave = (e) => {
    e.preventDefault();
    setPersonalDetails(personalFormData);
    SetIsEditing(false);
  };

  const handleCancel = () => {
    setPersonalFormData(personalDetails);
    SetIsEditing(false);
  };
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(() => {
    const savedInfo = localStorage.getItem("personalInfo");
    return savedInfo
      ? JSON.parse(savedInfo)
      : {
          name: "Akanksha Khurana",
          dob: "2007-12-16",
          gender: "Female",
          phoneno: "6283722167",
          email: "akankshakhurana01@gmail.com",
          location: "Chandigarh,India",
          height: "175cm",
          weight: "50kg",
        };
  });
  const [personalInfoForm, setPersonalInfoForm] = useState(personalInfo);
  useEffect(() => {
    localStorage.setItem("personalInfo", JSON.stringify(personalInfo));
  }, [personalInfo]);
  const handleChange1 = (e) => {
    setPersonalInfoForm({
      ...personalInfoForm,
      [e.target.name]: [e.target.value],
    });
  };
  const handleSave1 = (e) => {
    e.preventDefault();
    setPersonalInfo(personalInfoForm);
    setIsEditingPersonal(false);
  };
  const handleCancel1 = () => {
    setPersonalInfoForm(personalInfo);
    setIsEditingPersonal(false);
  };

  const [isMedicalEditing, setIsMedicalEditing] = useState(false);

  const [medicalInfo, setMedicalInfo] = useState(() => {
    const savedMedicalInfo = localStorage.getItem("medicalInfo");
    return savedMedicalInfo
      ? JSON.parse(savedMedicalInfo)
      : {
          bloodGroup: "O+",
          allergies: "None",
          chronicConditions: "None",
          currentMedications: "None",
          pastIllnesses: "None",
          otherNotes: "-",
        };
  });

  const [medicalForm, setMedicalForm] = useState(medicalInfo);
  useEffect(() => {
    localStorage.setItem("medicalInfo", JSON.stringify(medicalInfo));
  }, [medicalInfo]);

  const handleMedicalChange = (e) => {
    const { name, value } = e.target;

    setMedicalForm({
      ...medicalForm,
      [name]: value,
    });
  };

  const handleMedicalEdit = () => {
    setMedicalForm({ ...medicalInfo });
    setIsMedicalEditing(true);
  };

  const handleMedicalSave = (e) => {
    e.preventDefault();
    setMedicalInfo({ ...medicalForm });
    setIsMedicalEditing(false);
  };

  const handleMedicalCancel = () => {
    setMedicalForm({ ...medicalInfo });
    setIsMedicalEditing(false);
  };

  const [isEmergencyEditing, setIsEmergencyEditing] = useState(false);

  const [emergencyInfo, setEmergencyInfo] = useState(() => {
    const savedEmergencyInfo = localStorage.getItem("emergencyInfo");
    return savedEmergencyInfo
      ? JSON.parse(savedEmergencyInfo)
      : {
          name: "Suresh Khurana",
          phone: "8728074400",
          relation: "Father",
          address: "Chandigarh,India",
        };
  });

  const [emergencyForm, setEmergencyForm] = useState(emergencyInfo);
  useEffect(() => {
    localStorage.setItem("emergencyInfo", JSON.stringify(emergencyInfo));
  }, [emergencyInfo]);

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;

    setEmergencyForm({
      ...emergencyForm,
      [name]: value,
    });
  };

  const handleEmergencyEdit = () => {
    setEmergencyForm({ ...emergencyInfo });
    setIsEmergencyEditing(true);
  };

  const handleEmergencySave = (e) => {
    e.preventDefault();
    setEmergencyInfo({ ...emergencyForm });
    setIsEmergencyEditing(false);
  };

  const handleEmergencyCancel = () => {
    setEmergencyForm({ ...emergencyInfo });
    setIsEmergencyEditing(false);
  };

  return (
    <div className="profile">
      <div className="profile-card">
        <div className="profile-img">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="profile-img"
          />
        </div>
        <div className="profile-info">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={personalFormData.name}
              />
              <label>Gender</label>
              <select
                name="gender"
                value={personalFormData.gender}
                onChange={handleChange}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
              <label>Age</label>
              <input
                type="number"
                value={personalFormData.age}
                onChange={handleChange}
                name="age"
              />
              <label>Location</label>
              <input
                name="location"
                onChange={handleChange}
                value={personalFormData.location}
              />
              <div className="form-buttons">
                <button className="button" type="submit">
                  Save Changes
                </button>

                <button className="button" type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2>{personalDetails.name}</h2>
              <p>{personalDetails.gender}</p>
              <p>{personalDetails.age}</p>
              <p>{personalDetails.location}</p>
              <p>"Better health,Brigther days.💚"</p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  setPersonalFormData(personalDetails);
                  SetIsEditing(true);
                }}
              >
                <i class="fa-solid fa-pencil"></i>&nbsp;&nbsp;Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
      <div className="personal-details">
        <div className="header-details">
          <h2>
            <i class="fa-solid fa-user"></i>&nbsp;&nbsp;Personal Details
          </h2>
          <button
            onClick={() => {
              setIsEditingPersonal(true);
              setPersonalInfoForm(personalInfo);
            }}
          >
            <i class="fa-solid fa-pencil"></i>&nbsp;&nbsp;Edit
          </button>
        </div>
        <div className="body-details">
          {isEditingPersonal ? (
            <form onSubmit={handleSave1}>
              <label>Full Name</label>
              <input
                type="text"
                onChange={handleChange1}
                name="name"
                value={personalInfoForm.name}
              />
              <label>Date of birth</label>
              <input
                type="date"
                onChange={handleChange1}
                value={personalInfoForm.dob}
                name="dob"
              />
              <label>Gender</label>
              <select
                onChange={handleChange1}
                value={personalInfoForm.gender}
                name="gender"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
              <label>Phone Number</label>
              <input
                type="text"
                onChange={handleChange1}
                value={personalInfoForm.phoneno}
                name="phoneno"
              />
              <label>Email Address</label>
              <input
                type="email"
                onChange={handleChange1}
                value={personalInfoForm.email}
                name="email"
              />
              <label>Location</label>
              <input
                type="text"
                onChange={handleChange1}
                value={personalInfoForm.location}
                name="location"
              />
              <label>Height</label>
              <input
                type="text"
                onChange={handleChange1}
                value={personalInfoForm.height}
                name="height"
              />
              <label>Weight</label>
              <input
                type="text"
                onChange={handleChange1}
                value={personalInfoForm.weight}
                name="weight"
              />
              <div className="form-buttons">
                <button className="button" type="submit">
                  Save Changes
                </button>

                <button
                  className="button"
                  type="button"
                  onClick={handleCancel1}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <label>Full Name</label>
              <p>{personalInfoForm.name}</p>
              <label>Date of Birth</label>
              <p>{personalInfoForm.dob}</p>
              <label>Gender</label>
              <p>{personalInfoForm.gender}</p>
              <label>Phone Number</label>
              <p>{personalInfoForm.phoneno}</p>
              <label>Email Address</label>
              <p>{personalInfoForm.email}</p>
              <label>Location</label>
              <p>{personalInfoForm.location}</p>
              <label>Height</label>
              <p>{personalInfoForm.height}</p>
              <label>Weight</label>
              <p>{personalInfoForm.weight}</p>
            </>
          )}
        </div>
      </div>
      <div className="medical-info">
        <div className="header-medical">
          <h2>
            <i class="fa-solid fa-stethoscope"></i>&nbsp;&nbsp;Medical
            Information
          </h2>
          <button className="button" type="button" onClick={handleMedicalEdit}>
            <i class="fa-solid fa-pencil"></i>&nbsp;&nbsp;Edit
          </button>
        </div>
        <div className="body-medical">
          {isMedicalEditing ? (
            <form onSubmit={handleMedicalSave}>
              <label>Blood Group</label>
              <input
                name="bloodGroup"
                value={medicalForm.bloodGroup}
                onChange={handleMedicalChange}
              />
              <label>Allergies</label>
              <input
                name="allergies"
                value={medicalForm.allergies}
                onChange={handleMedicalChange}
              />

              <label>Chronic Conditions</label>
              <input
                name="chronicConditions"
                value={medicalForm.chronicConditions}
                onChange={handleMedicalChange}
              />

              <label>Current Medications</label>
              <input
                name="currentMedications"
                value={medicalForm.currentMedications}
                onChange={handleMedicalChange}
              />

              <label>Past Illnesses</label>
              <input
                name="pastIllnesses"
                value={medicalForm.pastIllnesses}
                onChange={handleMedicalChange}
              />

              <label>Other Notes</label>
              <textarea
                name="otherNotes"
                value={medicalForm.otherNotes}
                onChange={handleMedicalChange}
              />
              <div className="form-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={handleMedicalCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <label>Blood Group</label>
              <p>{medicalForm.bloodGroup}</p>
              <label>Allergies</label>
              <p>{medicalForm.allergies}</p>
              <label>Chronic conditions</label>
              <p>{medicalForm.chronicConditions}</p>
              <label>Current Medications</label>
              <p>{medicalForm.currentMedications}</p>
              <label>Past Illnesses</label>
              <p>{medicalForm.pastIllnesses}</p>
              <label>Other Notes</label>
              <p>{medicalForm.otherNotes}</p>
            </>
          )}
        </div>
      </div>
      <div className="emergency-info">
        <div className="header-emergency">
          <h2>
            <i class="fa-solid fa-user"></i>&nbsp;&nbsp;Emergency Contact
          </h2>
          <button onClick={handleEmergencyEdit}>
            <i class="fa-solid fa-pencil"></i>
            &nbsp;&nbsp;Edit
          </button>
        </div>
        <div className="body-emergency">
          {isEmergencyEditing ? (
            <form onSubmit={handleEmergencySave}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={emergencyForm.name}
                onChange={handleEmergencyChange}
                placeholder="Enter contact name"
                required
              />

              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={emergencyForm.phone}
                onChange={handleEmergencyChange}
                placeholder="Enter phone number"
                required
              />

              <label>Relation</label>
              <input
                type="text"
                name="relation"
                value={emergencyForm.relation}
                onChange={handleEmergencyChange}
                placeholder="e.g. Mother, Father"
                required
              />

              <label>Address</label>
              <textarea
                name="address"
                value={emergencyForm.address}
                onChange={handleEmergencyChange}
                placeholder="Enter address"
                required
              />
              <div className="form-buttons">
                <button type="submit">Save Changes</button>

                <button type="button" onClick={handleEmergencyCancel}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <label>Name</label>
              <p>{emergencyInfo.name}</p>
              <label>Phone Number</label>
              <p>{emergencyInfo.phone}</p>
              <label>Relation</label>
              <p>{emergencyInfo.relation}</p>
              <label>Address</label>
              <p>{emergencyInfo.address}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
