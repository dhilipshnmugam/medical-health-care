import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to HealthPass</h1>
        <p className="hero-text">
          A secure healthcare platform with QR-based medical ID and digital prescriptions
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Get Started</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Medical ID</h3>
            <p>Aadhaar-linked QR code for your medical identity</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Digital Prescriptions</h3>
            <p>Paperless prescriptions from your doctor to pharmacy</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>For Doctors</h3>
            <p>Easily create and manage digital prescriptions</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>For Medical Shops</h3>
            <p>Scan QR codes to verify and dispense medication</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register with Aadhaar</h3>
            <p>Create your secure HealthPass account using Aadhaar verification</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Your QR Code</h3>
            <p>Receive a unique QR code that contains your medical identity</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Visit Doctor</h3>
            <p>Doctor scans your QR code and creates digital prescriptions</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Medication</h3>
            <p>Medical shops scan your QR code to dispense prescribed medication</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
