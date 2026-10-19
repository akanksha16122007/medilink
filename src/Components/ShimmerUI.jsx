import React, { useState } from "react";

const sidebarItems = [
  "home",
  "analytics",
  "records",
  "calendar",
  "profile",
  "health",
  "folder",
  "settings",
];

function SidebarIcon({ type }) {
  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.5V21h13V9.5" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    analytics: (
      <>
        <path d="M4 19V10" />
        <path d="M10 19V5" />
        <path d="M16 19v-8" />
        <path d="M22 19V3" />
      </>
    ),
    records: (
      <>
        <path d="M6 3h9l5 5v13H6z" />
        <path d="M15 3v5h5" />
        <path d="M9 13h7M9 17h7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 2v6M17 2v6M3 10h18" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
      </>
    ),
    health: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
        <path d="M4 12h4l2-3 3 6 2-3h5" />
      </>
    ),
    folder: (
      <>
        <path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10H3z" />
        <path d="m3 18 3-8h15l-3 8z" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-3l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.5-2.6 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.5-2.6 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h3l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.5 2.6-1.4 1.1a7 7 0 0 1 0 2z" />
      </>
    ),
  };

  return (
    <svg
      className="hs-sidebar-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  );
}

function SkeletonLine({ className = "" }) {
  return <span className={`hs-line ${className}`} />;
}

function ImagePlaceholder({ className = "" }) {
  return (
    <div className={`hs-image-placeholder ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="16.5" cy="7.5" r="1.5" />
        <path d="m4 17 5-5 3 3 2-2 6 6" />
      </svg>
    </div>
  );
}

function HomeShimmer() {
  return (
    <div className="home-shimmer">
      {/* Header */}
      <header className="hs-header">
        <div className="hs-header-brand">
          <div className="hs-menu-button">
            <span />
            <span />
            <span />
          </div>

          <div className="hs-logo-mark">
            <span />
            <span />
          </div>

          <SkeletonLine className="hs-logo-text" />
        </div>

        <div className="hs-header-actions">
          <div className="hs-notification">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
          </div>

          <div className="hs-profile-avatar">
            <span />
          </div>

          <SkeletonLine className="hs-profile-name" />
        </div>
      </header>

      {/* Sidebar */}
      <aside className="hs-sidebar">
        <div className="hs-sidebar-menu">
          <span />
          <span />
          <span />
        </div>

        <nav className="hs-sidebar-nav" aria-label="Loading navigation">
          {sidebarItems.map((item, index) => (
            <div
              className={`hs-sidebar-item ${index === 0 ? "active" : ""}`}
              key={item}
            >
              <SidebarIcon type={item} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="hs-main">
        {/* Hero section */}
        <section className="hs-hero">
          <div className="hs-hero-decoration hs-decoration-top" />

          <div className="hs-hero-content">
            <SkeletonLine className="hs-eyebrow" />
            <SkeletonLine className="hs-hero-title" />
            <SkeletonLine className="hs-hero-title hs-title-short" />
            <SkeletonLine className="hs-hero-description" />
            <SkeletonLine className="hs-hero-description hs-description-short" />

            <div className="hs-hero-buttons">
              <SkeletonLine className="hs-button hs-button-primary" />
              <SkeletonLine className="hs-button hs-button-secondary" />
            </div>
          </div>

          <div className="hs-hero-art">
            <div className="hs-art-circle">
              <ImagePlaceholder className="hs-doctor-placeholder" />
              <SkeletonLine className="hs-art-detail hs-art-detail-one" />
              <SkeletonLine className="hs-art-detail hs-art-detail-two" />
              <div className="hs-art-bubble">+</div>
            </div>
          </div>

          <div className="hs-hero-decoration hs-decoration-bottom" />
        </section>

        {/* Features */}
        <section className="hs-features">
          <div className="hs-section-heading">
            <SkeletonLine className="hs-section-label" />
            <SkeletonLine className="hs-section-title" />
          </div>

          <div className="hs-feature-grid">
            {[1, 2, 3].map((item) => (
              <article className="hs-feature-card" key={item}>
                <div className="hs-feature-icon">
                  <SkeletonLine className="hs-icon-shape" />
                </div>

                <SkeletonLine className="hs-card-title" />
                <SkeletonLine className="hs-card-description" />
                <SkeletonLine className="hs-card-description hs-card-description-short" />
                <SkeletonLine className="hs-card-link" />
              </article>
            ))}
          </div>
        </section>

        {/* Why MediLink */}
        <section className="hs-why">
          <div className="hs-why-copy">
            <SkeletonLine className="hs-section-label" />
            <SkeletonLine className="hs-why-title" />
            <SkeletonLine className="hs-why-title hs-why-title-short" />
            <SkeletonLine className="hs-why-description" />
            <SkeletonLine className="hs-why-description" />
            <SkeletonLine className="hs-why-description hs-why-description-short" />
          </div>

          <div className="hs-why-list">
            {[1, 2, 3].map((item) => (
              <div className="hs-why-item" key={item}>
                <SkeletonLine className="hs-step-number" />
                <div className="hs-why-item-lines">
                  <SkeletonLine className="hs-step-line" />
                  <SkeletonLine className="hs-step-line hs-step-line-short" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Started / CTA */}
        <section className="hs-cta">
          <div className="hs-cta-copy">
            <SkeletonLine className="hs-section-label" />
            <SkeletonLine className="hs-cta-title" />
            <SkeletonLine className="hs-cta-title hs-cta-title-short" />
            <SkeletonLine className="hs-cta-description" />
            <SkeletonLine className="hs-cta-description hs-cta-description-short" />
            <SkeletonLine className="hs-button hs-button-primary hs-cta-button" />
          </div>

          <div className="hs-cta-art">
            <div className="hs-cta-art-circle" />
            <ImagePlaceholder className="hs-cta-image" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomeShimmer;
