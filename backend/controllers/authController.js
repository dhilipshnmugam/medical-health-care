const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { 
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
  } = req.body;
  
  try {
    // Check existing user by email
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User with this email already registered' });

    // Check existing user by ID number
    existing = await User.findOne({ idNumber });
    if (existing) return res.status(400).json({ message: 'User with this ID number already registered' });
    
    // Validate required fields
    if (!email || !name || !phoneNumber || !dateOfBirth || !address || !idType || !idNumber || !password || !role) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Validate ID document upload
    const idDocUrl = idDocumentUrl || 'uploads/placeholder-id.jpg'; // In production, this should be a required upload
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Prepare user object
    const userData = { 
      email, 
      name, 
      phoneNumber, 
      dateOfBirth, 
      gender, 
      address, 
      idType, 
      idNumber, 
      idDocumentUrl: idDocUrl, 
      password: hashed, 
      role 
    };
    
    if (role === 'Patient') {
      // Generate QR code for patient (using email as unique identifier)
      const qrDataUrl = await QRCode.toDataURL(email);
      userData.qrCode = qrDataUrl;
    }

    try {
      const user = new User(userData);
      await user.save();
      console.log('User registration successful');
      
      // Create JWT
      const jwtSecret = process.env.JWT_SECRET || 'mock_jwt_secret_for_development';
      const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
      return res.json({ token, user: { id: user._id, email: user.email, name, role, qrCode: user.qrCode } });
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).json({ message: 'Failed to save user data. Please try again.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const jwtSecret = process.env.JWT_SECRET || 'mock_jwt_secret_for_development';
    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name, 
        role: user.role, 
        qrCode: user.qrCode 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
