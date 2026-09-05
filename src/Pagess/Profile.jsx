import React, { useState, useEffect } from "react";

const Profile = () => {

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    phoneno: "",
    allergies: "",
    medical: "",
  });


  // Load saved profile
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);


  // Handle input changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };


  // Save profile
  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "profile",
      JSON.stringify(profile)
    );

    alert("Profile saved successfully!");
  };


  return (
    <div className="profile-page">

      <div className="profile-content">

        {/* Heading */}

        <div className="profile-heading">

          <p className="profile-label">
            STAY HEALTH READY
          </p>

          <h1>
            My <span>Health Profile</span>
          </h1>

          <p className="profile-description">
            Keep your personal and health information
            organized in one place.
          </p>

        </div>


        {/* Form */}

        <form onSubmit={handleSubmit}>

          <div className="form-group full-width">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={profile.age}
              onChange={handleChange}
            />
          </div>


          <div className="form-group">
            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={profile.bloodGroup}
              onChange={handleChange}
            >
              <option value="">
                Select blood group
              </option>

              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>


          <div className="form-group full-width">
            <label>Emergency Contact</label>

            <input
              type="tel"
              name="phoneno"
              placeholder="e.g. +91 XXXXX XXXXX"
              value={profile.phoneno}
              onChange={handleChange}
            />
          </div>


          <div className="form-group full-width">
            <label>Allergies</label>

            <input
              type="text"
              name="allergies"
              placeholder="e.g. Dust, pollen or None"
              value={profile.allergies}
              onChange={handleChange}
            />
          </div>


          <div className="form-group full-width">
            <label>Medical Conditions</label>

            <input
              type="text"
              name="medical"
              placeholder="e.g. Asthma or None"
              value={profile.medical}
              onChange={handleChange}
            />
          </div>


          <button
            type="submit"
            className="submit"
          >
            Save Profile →
          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;
