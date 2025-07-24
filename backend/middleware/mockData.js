// Mock data for development mode
const mockUsers = [
  {
    _id: '60d0fe4f5311236168a109ca',
    email: 'john@example.com',
    name: 'John Doe',
    phoneNumber: '9876543210',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'Male',
    address: '123 Main St, City, Country',
    idType: 'Aadhaar Card',
    idNumber: '123456789012',
    idDocumentUrl: 'uploads/mock-id-document.jpg',
    role: 'Patient',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...',
  },
  {
    _id: '60d0fe4f5311236168a109cb',
    email: 'jane@example.com',
    name: 'Dr. Jane Smith',
    phoneNumber: '9876543211',
    dateOfBirth: new Date('1985-11-22'),
    gender: 'Female',
    address: '456 Hospital Ave, City, Country',
    idType: 'Passport',
    idNumber: 'P12345678',
    idDocumentUrl: 'uploads/mock-id-document.jpg',
    role: 'Doctor',
  },
  {
    _id: '60d0fe4f5311236168a109cc',
    email: 'shop@example.com',
    name: 'MedShop Owner',
    phoneNumber: '9876543212',
    dateOfBirth: new Date('1992-03-30'),
    gender: 'Male',
    address: '789 Pharmacy St, City, Country',
    idType: 'Driving License',
    idNumber: 'DL1234567',
    idDocumentUrl: 'uploads/mock-id-document.jpg',
    role: 'MedicalShop',
  },
  {
    _id: '60d0fe4f5311236168a109cd',
    email: 'admin@example.com',
    name: 'Admin User',
    phoneNumber: '9876543213',
    dateOfBirth: new Date('1988-07-12'),
    gender: 'Other',
    address: '101 Admin Building, City, Country',
    idType: 'Voter ID',
    idNumber: 'VOT123456',
    idDocumentUrl: 'uploads/mock-id-document.jpg',
    role: 'Admin',
  }
];

const mockPrescriptions = [
  {
    _id: 'presc001',
    patient: '60d0fe4f5311236168a109ca',
    doctor: '60d0fe4f5311236168a109cb',
    patientName: 'John Doe',
    doctorName: 'Dr. Jane Smith',
    status: 'active',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '5 days',
        instructions: 'Take after meals'
      },
      {
        name: 'Cetirizine',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '3 days',
        instructions: 'Take before sleep'
      }
    ],
    createdAt: new Date('2025-07-22T10:30:00')
  },
  {
    _id: 'presc002',
    patient: '60d0fe4f5311236168a109ca',
    doctor: '60d0fe4f5311236168a109cb',
    patientName: 'John Doe',
    doctorName: 'Dr. Jane Smith',
    status: 'fulfilled',
    medications: [
      {
        name: 'Amoxicillin',
        dosage: '250mg',
        frequency: 'Three times daily',
        duration: '7 days',
        instructions: 'Take with water'
      }
    ],
    createdAt: new Date('2025-07-15T14:20:00'),
    fulfilledAt: new Date('2025-07-15T17:45:00')
  }
];

// Monkey patch the mongoose User model for mock data mode
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Store registered users for mock mode
const registeredUsers = [...mockUsers];

// Monkey patch User.findOne
const originalFindOne = User.findOne;
User.findOne = function(conditions) {
  console.log('Mock User.findOne called with:', conditions);
  
  if (process.env.USE_MOCK_DATA === 'true') {
    // For mock mode, return a promise that resolves with the found user
    return new Promise((resolve) => {
      if (conditions.email) {
        const user = registeredUsers.find(u => u.email === conditions.email);
        console.log('Mock User.findOne result:', user || null);
        return resolve(user || null);
      }
      if (conditions.idNumber) {
        const user = registeredUsers.find(u => u.idNumber === conditions.idNumber);
        console.log('Mock User.findOne result:', user || null);
        return resolve(user || null);
      }
      if (conditions._id) {
        const user = registeredUsers.find(u => u._id === conditions._id);
        console.log('Mock User.findOne result:', user || null);
        return resolve(user || null);
      }
      return resolve(null);
    });
  }
  
  // For database mode, use the original method
  return originalFindOne.apply(this, arguments);
};

// Monkey patch User.prototype.save
const crypto = require('crypto');
const originalSave = User.prototype.save;
User.prototype.save = function() {
  console.log('Mock User.save called');
  
  if (process.env.USE_MOCK_DATA === 'true') {
    // For mock mode, return a promise that resolves with the saved user
    return new Promise((resolve) => {
      // Generate a mock ID if needed
      if (!this._id) {
        this._id = 'mock_user_' + crypto.randomBytes(6).toString('hex');
      }
      
      // Add to the registered users list
      // Make sure we handle both mongoose documents and plain objects
      let userToSave = this;
      
      // Check if we're dealing with a mongoose document with toObject method
      if (this.toObject && typeof this.toObject === 'function') {
        userToSave = this.toObject();
      } 
      // Otherwise if it's just a plain object, clone it
      else {
        userToSave = JSON.parse(JSON.stringify(this));
      }
      
      registeredUsers.push(userToSave);
      console.log('Mock user saved:', userToSave);
      return resolve(this);
    });
  }
  
  // For database mode, use the original method
  return originalSave.apply(this, arguments);
};

const mockMiddleware = (req, res, next) => {
  // Mock authentication
  if (req.path === '/api/auth/register') {
    // Just pass the request through to our mocked User model functions
    console.log('Registration request in mock mode, proceeding to controller');
    return next();
  }
  
  if (req.path === '/api/auth/login') {
    // Let the controller handle login with our mocked User.findOne
    console.log('Login request in mock mode, proceeding to controller');
    return next();
  }
  
  if (req.path === '/api/auth/login') {
    const { aadhaarNumber } = req.body;
    const user = mockUsers.find(u => u.aadhaarNumber === aadhaarNumber);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    return res.json({
      token: 'mock_token_for_development',
      user: { id: user._id, aadhaarNumber: user.aadhaarNumber, name: user.name, role: user.role, qrCode: user.qrCode }
    });
  }
  
  if (req.path === '/api/auth/user') {
    // Extract user ID from token
    const tokenHeader = req.header('x-auth-token');
    if (!tokenHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    // In mock mode, always return the first user (patient)
    return res.json(mockUsers[0]);
  }
  
  // Mock prescription routes
  if (req.path === '/api/prescriptions' && req.method === 'GET') {
    return res.json(mockPrescriptions);
  }
  
  if (req.path.startsWith('/api/prescriptions/') && req.method === 'GET') {
    const prescId = req.path.split('/')[3];
    const prescription = mockPrescriptions.find(p => p._id === prescId);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    return res.json(prescription);
  }
  
  // If no mock endpoint matched, proceed to the real routes
  next();
};

module.exports = mockMiddleware;
