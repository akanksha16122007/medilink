import "./App.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Login from "./Pagess/Login";
import Profile from "./Pagess/Profile";
import Records from "./Pagess/Records";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Header />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/records" element={<Records />} />
        </Routes>

        <Footer />

      </BrowserRouter>
    </div>
  );
}

export default App;