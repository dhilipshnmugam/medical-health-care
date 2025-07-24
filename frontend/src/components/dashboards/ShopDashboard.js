import React, { useState } from 'react';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import axios from 'axios';
import './ShopDashboard.css';

const ShopDashboard = () => {
  const [scanResult, setScanResult] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  const handleScan = async (result) => {
    if (result) {
      setScanResult(result?.text);
      setShowScanner(false);
      
      // Now fetch the prescription data
      try {
        setLoading(true);
        setError('');
        
        // Assuming the QR code contains a prescription ID
        const prescriptionId = result?.text;
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:5000/api/prescriptions/${prescriptionId}`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        setPrescription(response.data);
        setVerificationStatus('valid');
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setError(err.response?.data?.message || 'Failed to verify prescription');
        setVerificationStatus('invalid');
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleError = (err) => {
    console.error('QR Scanner Error:', err);
    setError('Error accessing camera. Please make sure you have given camera permissions.');
  };
  
  const fulfillPrescription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/prescriptions/${prescription._id}/fulfill`, {}, {
        headers: {
          'x-auth-token': token
        }
      });
      
      setPrescription({
        ...prescription,
        status: 'fulfilled',
        fulfilledAt: new Date()
      });
      
      setVerificationStatus('fulfilled');
    } catch (err) {
      setError('Failed to mark prescription as fulfilled');
      console.error('Error fulfilling prescription:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const startNewScan = () => {
    setScanResult(null);
    setPrescription(null);
    setError('');
    setVerificationStatus(null);
    setShowScanner(true);
  };
  
  return (
    <div className="shop-dashboard-container">
      <h1>Medical Shop Dashboard</h1>
      <p className="dashboard-subtitle">Scan and verify prescriptions</p>
      
      {error && <div className="error-message">{error}</div>}
      
      {!showScanner && !scanResult && (
        <div className="scan-button-container">
          <button className="scan-button" onClick={() => setShowScanner(true)}>
            Scan Prescription QR Code
          </button>
        </div>
      )}
      
      {showScanner && (
        <div className="scanner-container">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            scanDelay={500}
            onResult={handleScan}
            onError={handleError}
            style={{ width: '100%', maxWidth: '500px' }}
          />
          <button className="cancel-scan-button" onClick={() => setShowScanner(false)}>
            Cancel Scan
          </button>
        </div>
      )}
      
      {loading && <div className="loading">Verifying prescription...</div>}
      
      {prescription && verificationStatus === 'valid' && (
        <div className="prescription-details">
          <div className="verification-banner success">
            ✅ Valid Prescription
          </div>
          <h2>Prescription Details</h2>
          <div className="prescription-info">
            <p><strong>Patient Name:</strong> {prescription.patientName}</p>
            <p><strong>Doctor Name:</strong> {prescription.doctorName}</p>
            <p><strong>Date Issued:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {prescription.status}</p>
          </div>
          
          <div className="medication-list">
            <h3>Medications</h3>
            <ul>
              {prescription.medications.map((med, index) => (
                <li key={index} className="medication-item">
                  <div className="medication-name">{med.name}</div>
                  <div className="medication-details">
                    <span className="dosage">{med.dosage}</span>
                    <span className="frequency">{med.frequency}</span>
                    <span className="duration">{med.duration}</span>
                  </div>
                  <div className="medication-instructions">{med.instructions}</div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="action-buttons">
            <button 
              className="fulfill-button"
              onClick={fulfillPrescription}
              disabled={prescription.status === 'fulfilled' || loading}
            >
              {loading ? 'Processing...' : 'Fulfill Prescription'}
            </button>
            <button className="new-scan-button" onClick={startNewScan}>
              Scan New Prescription
            </button>
          </div>
        </div>
      )}
      
      {verificationStatus === 'invalid' && (
        <div className="prescription-verification failed">
          <div className="verification-banner error">
            ❌ Invalid or Expired Prescription
          </div>
          <button className="new-scan-button" onClick={startNewScan}>
            Try Again
          </button>
        </div>
      )}
      
      {verificationStatus === 'fulfilled' && (
        <div className="prescription-verification success">
          <div className="verification-banner success">
            ✅ Prescription Successfully Fulfilled
          </div>
          <button className="new-scan-button" onClick={startNewScan}>
            Scan New Prescription
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
