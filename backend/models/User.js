const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String, required: true },
  idType: { type: String, enum: ['Aadhaar Card', 'Driving License', 'Passport', 'Voter ID'], required: true },
  idNumber: { type: String, required: true },
  idDocumentUrl: { type: String, required: true }, // URL or path to the uploaded ID document
  role: { type: String, enum: ['Doctor','Patient','MedicalShop','Admin'], required: true },
  password: { type: String, required: true },
  qrCode: { type: String } // Data URL for patient QR
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
