import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="main-container">
      <nav className="nav-wrapper">
        <div className="logo-section">
          <div className="logo-dot" />
          <span className="brand-name">ALTERNATIVE SOLUTIONS</span>
        </div>
        <div className="nav-links">
          <Link href="#services" className="nav-item">SERVICES</Link>
          <Link href="/shift-studio" className="nav-item">SHIFT STUDIO</Link>
          <button className="portal-button">CLIENT PORTAL</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge">NOW AVAILABLE</div>
        <h1 className="hero-title">
          SMARTER <br />
          <span className="blue-text">BUSINESS SYSTEMS.</span>
        </h1>
        <p className="hero-subtitle">
          Stop fighting with spreadsheets. We build custom software and simple tools 
          to help your business run smoother.
        </p>
        
        <div className="cta-group">
          <Link href="/shift-studio" className="btn-primary">
            TRY SHIFT STUDIO
          </Link>
          <button className="btn-secondary">
            VIEW SERVICES
          </button>
        </div>
      </section>

      <section className="product-grid">
        <div className="product-card">
          <h3 className="card-title">Shift Studio</h3>
          <p className="card-text">
            The simple operating system for makers. Track inventory, 
            manage recipes, and see your profit in one place.
          </p>
        </div>
        <div className="product-card empty-state" />
      </section>
    </main>
  );
}