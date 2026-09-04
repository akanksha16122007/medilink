import React from "react";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="profile-content">
        <h1>My Health Profile</h1>
        <p>Update your personal and health information.</p>
        <form>
          <label>Full Name</label>
          <input type="text" className="name" />
          <label>Age</label>
          <input type="number" className="age" />
          <label>Blood Group</label>
          <select className="blood-group">
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
          <input type="tel" className="phoneno" />
          <label>Allergies</label>
          <input type="text" className="allergies" />
          <label>Medical Conditions</label>
          <input type="text" className="medical" />
          <button className="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
