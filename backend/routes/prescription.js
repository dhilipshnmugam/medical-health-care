const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { 
  createPrescription, 
  getPrescriptionsForPatient, 
  getPrescription, 
  fulfillPrescription,
  getMyPrescriptions
} = require('../controllers/prescriptionController');

// Doctor creates prescription
router.post('/', verifyToken, authorizeRoles('Doctor'), createPrescription);

// Get all prescriptions for a specific patient
router.get('/patient/:patientId', verifyToken, authorizeRoles('Patient', 'Doctor', 'MedicalShop'), getPrescriptionsForPatient);

// Get all prescriptions for the logged-in user (patient only)
router.get('/', verifyToken, authorizeRoles('Patient'), getMyPrescriptions);

// Get a specific prescription by ID
router.get('/:id', verifyToken, authorizeRoles('Patient', 'Doctor', 'MedicalShop'), getPrescription);

// Medical Shop fulfills a prescription
router.put('/:id/fulfill', verifyToken, authorizeRoles('MedicalShop'), fulfillPrescription);

module.exports = router;
