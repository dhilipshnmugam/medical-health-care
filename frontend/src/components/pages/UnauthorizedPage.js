import React from 'react';
import { Link } from 'react-router-dom';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="error-container">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>Sorry, you do not have permission to access this page.</p>
        <p>Please contact your administrator if you believe this is an error.</p>
        
        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">Go to Home</Link>
          <Link to="/login" className="btn btn-secondary">Login as Different User</Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
