// Mock middleware to handle Aadhaar API requests directly in the backend
// This will be used when the separate mock Aadhaar API service is not available

const mockAadhaarData = {
  '123456789012': { name: 'John Doe', dateOfBirth: '1990-05-15' },
  '987654321098': { name: 'Jane Smith', dateOfBirth: '1985-11-22' },
  '555555555555': { name: 'Raj Patel', dateOfBirth: '1992-03-30' },
  '111122223333': { name: 'Priya Singh', dateOfBirth: '1988-07-12' },
  '111111111111': { name: 'Test User', dateOfBirth: '1995-01-01' },
  '222222222222': { name: 'Demo Patient', dateOfBirth: '2000-01-01' },
  '333333333333': { name: 'Sample Doctor', dateOfBirth: '1980-06-15' }
};

// Middleware to add Aadhaar API routes directly to our backend
const mockAadhaarMiddleware = (app) => {
  // Add mock Aadhaar API endpoints
  app.get('/aadhaar/:aadhaarNumber', (req, res, next) => {
    const { aadhaarNumber } = req.params;
    
    // Prevent conflict with the generate endpoint
    if (aadhaarNumber === 'generate') {
      return next();
    }
    
    const userData = mockAadhaarData[aadhaarNumber];
    
    if (!userData) {
      return res.status(404).json({ message: 'Aadhaar number not found' });
    }
    
    console.log(`Serving mock Aadhaar data for ${aadhaarNumber}:`, userData);
    res.json(userData);
  });
  
  // Generate random user for testing (must be defined after the specific route above)
  app.get('/aadhaar/generate/:aadhaarNumber', (req, res) => {
    const { aadhaarNumber } = req.params;
    
    if (mockAadhaarData[aadhaarNumber]) {
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
    
    mockAadhaarData[aadhaarNumber] = {
      name: `${randomFirst} ${randomLast}`,
      dateOfBirth: formattedDOB
    };
    
    res.json(mockAadhaarData[aadhaarNumber]);
  });
  
  console.log('Mock Aadhaar API endpoints added to backend');
};

module.exports = mockAadhaarMiddleware;
