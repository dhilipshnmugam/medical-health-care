import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };
  
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch(user.role) {
      case 'Patient': return '/patient-dashboard';
      case 'Doctor': return '/doctor-dashboard';
      case 'MedicalShop': return '/shop-dashboard';
      case 'Admin': return '/admin-dashboard';
      default: return '/';
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>HealthPass</h1>
        </Link>
      </div>
      
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        
        {isAuthenticated ? (
          <>
            <li><Link to={getDashboardLink()}>Dashboard</Link></li>
            <li className="user-info">
              <span>
                Welcome, {user?.name || 'User'}
                <span className="role-badge">{user?.role || 'User'}</span>
              </span>
            </li>
            <li><button className="logout-btn" onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
