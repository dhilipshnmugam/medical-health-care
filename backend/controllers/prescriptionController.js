const Prescription = require('../models/Prescription');
const User = require('../models/User');

exports.createPrescription = async (req, res) => {
  try {
    const { patientId, medications } = req.body;
    
    // Verify patient exists
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if patient role is correct
    if (patient.role !== 'Patient') {
      return res.status(400).json({ message: 'User is not a patient' });
    }
    
    // Create prescription
    const prescription = new Prescription({
      patient: patientId,
      doctor: req.user._id,
      patientName: patient.name,
      doctorName: req.user.name,
      medications
    });
    
    await prescription.save();
    
    res.status(201).json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPrescriptionsForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // If patient is requesting, verify it's their own prescriptions
    if (req.user.role === 'Patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: 'Not authorized to view these prescriptions' });
    }
    
    // Get prescriptions
    const prescriptions = await Prescription.find({ patient: patientId })
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Security check for patients
    if (req.user.role === 'Patient' && 
        prescription.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }
    
    res.json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.fulfillPrescription = async (req, res) => {
  try {
    // Only Medical Shops can fulfill prescriptions
    if (req.user.role !== 'MedicalShop') {
      return res.status(403).json({ message: 'Not authorized to fulfill prescriptions' });
    }
    
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    if (prescription.status !== 'active') {
      return res.status(400).json({ message: 'Prescription is already fulfilled or expired' });
    }
    
    // Update prescription status
    prescription.status = 'fulfilled';
    prescription.fulfilledAt = new Date();
    
    await prescription.save();
    
    res.json({ message: 'Prescription fulfilled', prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all prescriptions for the logged-in user
exports.getMyPrescriptions = async (req, res) => {
  try {
    if (req.user.role !== 'Patient') {
      return res.status(403).json({ message: 'Only patients can access this endpoint' });
    }
    
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
