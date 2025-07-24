const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'fulfilled', 'expired'], 
    default: 'active' 
  },
  medications: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: { type: String }
    }
  ],
  fulfilledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
