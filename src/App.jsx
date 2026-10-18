import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";
import MedicalGlossary from "./Components/MedicalGlossary";

import Home from "./Pagess/Home";
import Login from "./Pagess/Login";
import Profile from "./Pagess/Profile";
import Records from "./Pagess/Records";
import SignUp from "./Pagess/SignUp";
import Dashboard from "./Pagess/Dashboard";
import DocumentVault from "./Pagess/DocumentVault";
import HealthInsurance from "./Pagess/HealthInsurance";
import AppointmentPlanner from "./Pagess/AppointmentPlanner";
import Settings from "./Pagess/Settings";

import ProtectedRoutes from "./utils/ProtectedRoutes";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmergencyHealthPage from "./Components/EmergencyHealthPage";

function AppShell({ darkMode, toggleTheme }) {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />

      <div className="app-layout">
        {!hideSidebar && <Sidebar />}

        <div className="app-content">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/records" element={<Records />} />

              <Route
                path="/DocumentVault"
                element={<DocumentVault />}
              />

              <Route
                path="/HealthInsurance"
                element={<HealthInsurance />}
              />
              <Route path="/emergency-id" element={<EmergencyHealthPage />} />

              <Route
                path="/medical-glossary"
                element={<MedicalGlossary />}
              />

              <Route
                path="/settings"
                element={
                  <Settings darkMode={darkMode} toggleTheme={toggleTheme} />
                }
              />
              <Route
                path="/AppointmentPlanner"
                element={<AppointmentPlanner />}
              />
            </Route>
          </Routes>
        </div>
      </div>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>
      <BrowserRouter>
        <AppShell
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
