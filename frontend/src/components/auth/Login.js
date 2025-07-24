import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  // Check for any messages from redirect
  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
    }
  }, [location]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user types
    setError('');
    setSuccess('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Store user info in localStorage for easy access
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        name: response.data.user.name,
        role: response.data.user.role
      }));

      // Redirect based on role
      const role = response.data.user.role;
      switch(role) {
        case 'Patient':
          navigate('/patient-dashboard');
          break;
        case 'Doctor':
          navigate('/doctor-dashboard');
          break;
        case 'MedicalShop':
          navigate('/shop-dashboard');
          break;
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Authentication failed');
      } else {
        setError('Unable to connect to the server. Please try again.');
        console.error('Error:', err);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>HealthPass Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="form-footer">
          New to HealthPass? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
