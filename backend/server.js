require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
// ... you can add other route imports here

const app = express();
const PORT = process.env.PORT || 5000;

// Flag to check if we're using mock data
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Middleware
app.use(cors());
app.use(express.json());

// Use mock data middleware in development if specified
if (useMockData) {
  const mockDataMiddleware = require('./middleware/mockData');
  app.use(mockDataMiddleware);
  console.log('Running in mock data mode - no database required');
}

// Routes
app.use('/api/auth', authRoutes);
const prescriptionRoutes = require('./routes/prescription');
app.use('/api/prescriptions', prescriptionRoutes);

// Start server regardless of MongoDB connection
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/healthpass', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue running with limited functionality. Database operations will fail.');
    console.log('For development and testing purposes, you can continue using the app with mock data.');
  });
