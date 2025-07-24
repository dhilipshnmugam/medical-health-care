const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Mock Aadhaar database
const aadhaarDB = {
  '123456789012': { name: 'John Doe', dateOfBirth: '1990-05-15' },
  '987654321098': { name: 'Jane Smith', dateOfBirth: '1985-11-22' },
  '555555555555': { name: 'Raj Patel', dateOfBirth: '1992-03-30' },
  '111122223333': { name: 'Priya Singh', dateOfBirth: '1988-07-12' }
};

// Get user data by Aadhaar number
app.get('/aadhaar/:aadhaarNumber', (req, res) => {
  const { aadhaarNumber } = req.params;
  const userData = aadhaarDB[aadhaarNumber];
  
  if (!userData) {
    return res.status(404).json({ message: 'Aadhaar number not found' });
  }
  
  res.json(userData);
});

// Generate random user for testing
app.get('/aadhaar/generate/:aadhaarNumber', (req, res) => {
  const { aadhaarNumber } = req.params;
  
  if (aadhaarDB[aadhaarNumber]) {
    return res.status(400).json({ message: 'Aadhaar number already exists' });
  }
  
  const firstNames = ['Rahul', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Neha', 'Amit', 'Pooja'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Jain', 'Verma'];
  
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  // Generate random date of birth between 1970 and 2000
  const start = new Date(1970, 0, 1);
  const end = new Date(2000, 11, 31);
  const dob = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  const formattedDOB = dob.toISOString().split('T')[0];
  
  aadhaarDB[aadhaarNumber] = {
    name: `${randomFirst} ${randomLast}`,
    dateOfBirth: formattedDOB
  };
  
  res.json(aadhaarDB[aadhaarNumber]);
});

app.listen(PORT, () => {
  console.log(`Mock Aadhaar API running on port ${PORT}`);
});
