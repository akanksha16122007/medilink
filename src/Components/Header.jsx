import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


const Header = ({ darkMode, toggleTheme }) => {
  const getStoredUser = () => JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogOut, setshowLogOut] = useState(false);
  const [user, setUser] = useState(getStoredUser);

  const navigate = useNavigate();
  const location = useLocation();

const [speechRate, setSpeechRate] = useState(0.9);


  useEffect(() => {
    setUser(getStoredUser());
  }, [location]);

  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener("profileUpdated", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("profileUpdated", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setshowLogOut(false);
    navigate("/login");
  };
  const speakSelectedText=()=>{
    const selectedText=String(window.getSelection()||"").trim();
    if(!selectedText){
      alert("Please select some text first");
      return;

    }
    if(!("speechSynthesis" in window)){
      alert("Text-to-speech is not supported by this browser");
      return;
    }
    window.speechSynthesis.cancel();
    const speech=new SpeechSynthesisUtterance(selectedText);
   
     speech.lang="en-IN";
    speech.rate=Number(speechRate);
    speech.pitch=1;
    speech.volume=1;

 window.speechSynthesis.speak(speech);
  };
  const pauseOrResume=()=>{
    const synth=window.speechSynthesis;
    if(synth.paused){
      synth.resume();
    }
    else if(synth.speaking){
      synth.pause();
    }
  }
  const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <span className="logo-icon">✚</span>
        <span>MediLink</span>
      </Link>

      {/* Hamburger button */}
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation */}
      <nav className={menuOpen ? "nav active" : "nav"}>
        <i class="fa-solid fa-bell"></i>

 <div className="voice-settings">
  {/* <label htmlFor="speech-voice">Voice:</label>

  <select
    id="speech-voice"
    value={selectedVoice}
    onChange={(e) => setSelectedVoice(e.target.value)}
  >
    {voices.map((voice) => (
      <option key={`${voice.name}-${voice.lang}`} value={voice.name}>
        {voice.name} ({voice.lang})
      </option>
    ))}
  </select> */}

  <label htmlFor="speech-rate">Speed:</label>

  <select
    id="speech-rate"
    value={speechRate}
    onChange={(e) => setSpeechRate(Number(e.target.value))}
  >
    <option value={0.7}>Slow</option>
    <option value={.9}>Normal</option>
    <option value={1.25}>Fast</option>
  </select>
</div> 

        <div className="speech-controls">
          <button type="button" className="speech-btn" onClick={speakSelectedText} title="Read Selected Text Aloud">
             <i className="fa-solid fa-volume-high"></i>
            {" "}Read Selected Text
          </button>
          <button
          type="button" className="
          speech-btn" onClick={pauseOrResume}>
             <i className="fa-solid fa-pause"></i> Pause / Resume
   
          </button>
        <button type="button" className="speech-stop-btn" onClick={stopSpeaking}
        title="Stop Speaking">
           <i className="fa-solid fa-stop"></i>
          {" "}Stop Speaking
        </button>
        </div>

        {/* Login / User */}
        {user ? (
          <div className="user-info">
            <div
              className="profile-section"
              onClick={() => setshowLogOut(!showLogOut)}
            >
              <img
                src={
                  user?.profilePic ||
                  "https://i.pinimg.com/736x/db/a9/ce/dba9ce433113b68e719456b6d78c4f2a.jpg"
                }
                alt="Profile"
                className="profile-pic"
              />

              <span>{user.name}</span>
            </div>

            {/* Dropdown */}
            {showLogOut && (
              <div className="logout-menu">
                {/* Logout */}
                <button onClick={handleLogout}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  Logout
                </button>

                {/* Theme */}
                <button className="theme-menu-btn" onClick={toggleTheme}>
                  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
