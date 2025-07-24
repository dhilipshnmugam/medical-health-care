import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import UnauthorizedPage from './components/pages/UnauthorizedPage';
import './App.css';

// Import dashboard components
import ShopDashboard from './components/dashboards/ShopDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';

// Placeholder dashboard components for other roles
const DoctorDashboard = () => <div className="dashboard doctor-dashboard"><h2>Doctor Dashboard</h2><p>Welcome to your doctor dashboard. You can create and manage prescriptions here.</p></div>;
const AdminDashboard = () => <div className="dashboard admin-dashboard"><h2>Admin Dashboard</h2><p>Welcome to the admin dashboard. You can manage users and system settings here.</p></div>;

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* Protected routes with role-based access */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/shop-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['MedicalShop']}>
                  <ShopDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
