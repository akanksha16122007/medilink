import "./App.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";

import Home from "./Pagess/Home";
import Login from "./Pagess/Login";
import Profile from "./Pagess/Profile";
import Records from "./Pagess/Records";
import SignUp from "./Pagess/SignUp";
import Dashboard from "./Pagess/Dashboard";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>

        <Header />

        <Routes>


          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/signup"
            element={<SignUp />}
          />

          <Route
            path="/records"
            element={<Records />}
          />

=======
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/records" element={<Records />} />
        </Routes>

        <Footer />

      </BrowserRouter>
    </div>
  );
}

export default App;