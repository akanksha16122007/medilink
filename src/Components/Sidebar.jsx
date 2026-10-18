import React, { useState } from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [Open, setOpen] = useState(() => {
    const value = localStorage.getItem("sideBarOpen");
    if (value === null) {
      return true;
    }
    return JSON.parse(value);
  });
  const handleClick = () => {
    setOpen(!Open);
    localStorage.setItem("sideBarOpen", !Open);
  };
  return (
    <div className={Open ? "sidebar open" : "sidebar closed"}>
      <ul className="listItems">
        <li onClick={handleClick} className="menu-icon">
          <i className="fa-solid fa-bars desktop-menu-icon"></i>
        </li>
        <li>
          <Link to="/">
            <i class="fa-solid fa-house"></i>
            {Open && <span> Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <i class="fa-solid fa-chart-simple"></i>{" "}
            {Open && <span> Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/records">
            <i class="fa-regular fa-file-lines"></i>{" "}
            {Open && <span> Records</span>}
          </Link>
        </li>
        <li>
          <Link to="/AppointmentPlanner">
            <i class="fa-regular fa-calendar"></i>{" "}
            {Open && <span> Appointment Planner</span>}
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <i class="fa-solid fa-user"></i> {Open && <span> Profile</span>}
          </Link>
        </li>
        <li>
          <Link to="/HealthInsurance">
            <i class="fa-solid fa-heart-circle-check"></i>{" "}
            {Open && <span> Health Insurance</span>}
          </Link>
        </li>
        <li>
          <Link to="/DocumentVault">
            <i class="fa-regular fa-folder-open"></i>{" "}
            {Open && <span> Document Vault</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <i class="fa-solid fa-gear"></i> {Open && <span> Settings</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
