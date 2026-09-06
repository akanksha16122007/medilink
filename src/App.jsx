import "./App.css";

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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
          </Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
