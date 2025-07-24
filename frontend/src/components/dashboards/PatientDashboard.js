import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        // Get user data
        const userResponse = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            'x-auth-token': token
          }
        });
        setUser(userResponse.data);

        // Get user's prescriptions
        const prescriptionsResponse = await axios.get('http://localhost:5000/api/prescriptions', {
          headers: {
            'x-auth-token': token
          }
        });
        setPrescriptions(prescriptionsResponse.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading your data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="patient-dashboard-container">
      <h1>Patient Dashboard</h1>
      <p className="dashboard-subtitle">Your medical information and prescriptions</p>

      {user && (
        <div className="dashboard-section medical-id-card">
          <h2>Your Medical ID</h2>
          <div className="qr-container">
            <QRCodeSVG
              value={user.qrCode || user._id}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
              imageSettings={{
                src: "/logo192.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          <div className="patient-info">
            <h3>{user.name}</h3>
            <p><strong>Aadhaar:</strong> {user.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p className="id-instructions">Show this QR code to your doctor to easily share your medical information</p>
          </div>
        </div>
      )}

      <div className="dashboard-section prescriptions-section">
        <h2>Your Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p className="no-data">You don't have any prescriptions yet.</p>
        ) : (
          <div className="prescriptions-list">
            {prescriptions.map(prescription => (
              <div key={prescription._id} className="prescription-card">
                <div className={`prescription-status ${prescription.status}`}>
                  {prescription.status === 'active' ? '⏳ Active' : '✅ Fulfilled'}
                </div>
                <h3>Dr. {prescription.doctorName}</h3>
                <p className="prescription-date">Issued: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                
                <div className="medications">
                  <h4>Medications</h4>
                  <ul>
                    {prescription.medications.map((med, index) => (
                      <li key={index}>
                        <span className="med-name">{med.name}</span>
                        <span className="med-details">{med.dosage}, {med.frequency}, {med.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {prescription.status === 'fulfilled' && (
                  <p className="fulfilled-date">Fulfilled on: {new Date(prescription.fulfilledAt).toLocaleDateString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
