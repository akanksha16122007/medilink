import React, { useState, useEffect } from "react";

const Profile = () => {
  const [Profile, setProfile] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    phoneno: "",
    allergies: "",
    medical: "",
  });
  useEffect(() => {
    const savedProfile = localStorage.getItem("profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);
  const handleChange = (e) => {
    setProfile({
      ...Profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify(Profile));
    alert("Profile saved successfully!");
  };
  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1>My Health Profile</h1>
        <p>Update your personal and health information.</p>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            className="name"
            name="name"
            value={Profile.name}
            onChange={handleChange}
          />
          <label>Age</label>
          <input
            type="number"
            className="age"
            name="age"
            value={Profile.age}
            onChange={handleChange}
          />
          <label>Blood Group</label>
          <select
            className="bloodGroup"
            value={Profile.bloodGroup}
            name="bloodGroup"
            onChange={handleChange}
          >
            <option value="">Select Blood Group</option>
            <option value="o+">O+</option>
            <option value="o-">O-</option>
            <option value="a-">A-</option>
            <option value="a+">A+</option>
            <option value="B-">B-</option>
            <option value="B+">B+</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          <label>Emergency Contact</label>
          <input
            type="tel"
            className="phoneno"
            value={Profile.phoneno}
            onChange={handleChange}
            name="phoneno"
          />
          <label>Allergies</label>
          <input
            type="text"
            className="allergies"
            value={Profile.allergies}
            name="allergies"
            onChange={handleChange}
          />
          <label>Medical Conditions</label>
          <input
            type="text"
            className="medical"
            name="medical"
            value={Profile.medical}
            onChange={handleChange}
          />
          <button className="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
