import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    idType: 'Aadhaar Card',
    idNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Patient'
  });
  const [idDocument, setIdDocument] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { 
    email, 
    name, 
    phoneNumber, 
    dateOfBirth, 
    gender, 
    address, 
    idType, 
    idNumber,
    password, 
    confirmPassword, 
    role 
  } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handle file input changes
  const onFileChange = (e) => {
    setIdDocument(e.target.files[0]);
  };

  // Validate personal info and move to next step
  const validatePersonalInfo = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation for required fields
    if (!email || !name || !phoneNumber || !dateOfBirth || !address) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Phone validation (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Proceed to next step
    setStep(2);
  };

  // Validate ID information and move to final step
  const validateIdInfo = (e) => {
    e.preventDefault();
    setError('');
    
    // ID number validation based on type
    if (idType === 'Aadhaar Card' && !/^\d{12}$/.test(idNumber)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      return;
    } else if (idType === 'Driving License' && !idNumber) {
      setError('Please enter a valid Driving License number');
      return;
    } else if (idType === 'Passport' && !idNumber) {
      setError('Please enter a valid Passport number');
      return;
    } else if (idType === 'Voter ID' && !idNumber) {
      setError('Please enter a valid Voter ID number');
      return;
    }
    
    // Check if ID document is uploaded
    if (!idDocument) {
      setError('Please upload a scanned copy of your ID');
      return;
    }
    
    // Proceed to final step
    setStep(3);
  };
  
  // Final step - complete registration
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, we would first upload the ID document
      // and get back the URL to store in the database
      let idDocumentUrl = 'uploads/mock-id-document.jpg'; // Mock URL for development
      
      if (idDocument) {
        // Create a FormData object to simulate file upload
        // In production, this would be a real file upload
        const formData = new FormData();
        formData.append('idDocument', idDocument);
        
        // Simulating a successful upload for development
        console.log('ID document would be uploaded:', idDocument.name);
        
        // In production, we'd make an API call like this:
        // const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData);
        // idDocumentUrl = uploadResponse.data.url;
      }
      
      // Register with the backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        name,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
        idType,
        idNumber,
        idDocumentUrl,
        password,
        role
      });
      
      console.log('Registration successful:', response.data);
      
      // Redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response && err.response.data) {
        console.error('Server error details:', err.response.data);
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration');
        console.error('Unhandled error:', err);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>HealthPass Registration</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 && (
          <form onSubmit={validatePersonalInfo}>
            <h3>Step 1: Personal Information</h3>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
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
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                placeholder="Enter your 10-digit phone number"
                required
                maxLength="10"
              />
            </div>
            
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={gender} onChange={onChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={address}
                onChange={onChange}
                placeholder="Enter your full address"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Select Role</label>
              <select name="role" value={role} onChange={onChange}>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="MedicalShop">Medical Shop</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              Next
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={validateIdInfo}>
            <h3>Step 2: ID Verification</h3>
            
            <div className="form-group">
              <label>ID Type</label>
              <select name="idType" value={idType} onChange={onChange}>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Driving License">Driving License</option>
                <option value="Passport">Passport</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>ID Number</label>
              <input
                type="text"
                name="idNumber"
                value={idNumber}
                onChange={onChange}
                placeholder={`Enter your ${idType} number`}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Upload ID Document</label>
              <input
                type="file"
                name="idDocument"
                onChange={onFileChange}
                accept="image/jpeg,image/png,application/pdf"
                required
              />
              <small>Upload a scanned copy or clear photo of your ID document</small>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              Next
            </button>
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStep(1);
                setError('');
              }}
              disabled={isLoading}
            >
              Back
            </button>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={onSubmit}>
            <h3>Step 3: Create Password</h3>
            
            <div className="form-group">
              <label>Create Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a password (min 6 characters)"
                required
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
            <button 
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStep(2);
                setError('');
              }}
              disabled={isLoading}
            >
              Back
            </button>
          </form>
        )}
        
        <div className="form-footer">
          Already registered? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
