import "./App.css";
import React, { useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Home from "./Pagess/Home";
import Login from "./Pagess/Login";
import Profile from "./Pagess/Profile";
import Records from "./Pagess/Records";
import SignUp from "./Pagess/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pagess/Dashboard";
import DocumentVault from "./Pagess/DocumentVault";
import HealthInsurance from "./Pagess/HealthInsurance";
import AppointmentPlanner from "./Pagess/AppointmentPlanner";
import Settings from "./Pagess/Settings";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <BrowserRouter>
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route path="/DocumentVault" element={<DocumentVault />} />
            <Route path="/HealthInsurance" element={<HealthInsurance />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/AppointmentPlanner"
              element={<AppointmentPlanner />}
            />
          </Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
