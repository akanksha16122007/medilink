import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <span className="welcome-badge">WELCOME TO MEDILINK</span>

          <h1>
            Manage Your Health, <br />
            <span>All in One Place.</span>
          </h1>

          <p className="hero-description">
            Keep your medical records, prescriptions, and important health
            information together in one simple place, making everyday health
            management easier.
          </p>

          <div className="hero-buttons">
            <Link to="/records" className="hero-btn-primary">
              Get Started →
            </Link>
            <a href="#features" className="hero-btn-secondary">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="image-circle"></div>
          <img
            src="/girl1.png"
            alt="Healthcare illustration"
            className="hero-img"
          />
        </div>
      </section>


      {/* FEATURES SECTION */}
      <section className="features" id="features">
        <div className="section-heading">
          <span className="features-label">OUR FEATURES</span>
          <h2>
            Everything you need, <span>in one place.</span>
          </h2>
        </div>

        <div className="feature-grid">

          {/* CARD 1 */}
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Medical Records</h3>
            <p>Store and organise all your important medical reports securely.</p>
            <Link to="/records" className="card-link">
              View Records →
            </Link>
          </div>

          {/* CARD 2 */}
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Prescriptions</h3>
            <p>Keep track of your active medications and prescription history.</p>
            <Link to="/dashboard" className="card-link">
              View Dashboard →
            </Link>
          </div>

          {/* CARD 3 */}
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Health Profile</h3>
            <p>Save critical health details, allergies, and emergency contacts.</p>
            <Link to="/profile" className="card-link">
              View Profile →
            </Link>
          </div>

        </div>
      </section>


      {/* WHY MEDILINK */}
      <section className="why-medilink">
        <div className="why-text">
          <span className="why-label">WHY MEDILINK?</span>
          <h2>
            Your health information, <span>simplified.</span>
          </h2>
          <p>
            Medical records can often be scattered across disparate paper files,
            emails, and portals. MediLink aggregates everything into a single,
            intuitive interface.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <span className="why-number">01</span>
            <p>Centralize and organize all your medical history</p>
          </div>

          <div className="why-card">
            <span className="why-number">02</span>
            <p>Access critical health details instantly when needed</p>
          </div>

          <div className="why-card">
            <span className="why-number">03</span>
            <p>Keep family and emergency contact information consolidated</p>
          </div>
        </div>
      </section>


      {/* GET STARTED / CTA SECTION */}
      <section className="home-cta">
        <div className="cta-container">
          <div className="cta-text">
            <span className="cta-label">GET STARTED</span>
            <h2>
              Take control of your <span>health information today.</span>
            </h2>
            <p>
              Start organizing your medical information with MediLink in just a few clicks.
            </p>
            <Link to="/records" className="cta-btn">
              Get Started Now →
            </Link>
          </div>

          <div className="cta-image-wrapper">
            <img
              src="/girl2.png"
              alt="Healthcare illustration"
              className="cta-img"
            />
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;