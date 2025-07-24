const mockAadhaarData = {
  '123456789012': { name: 'John Doe', dateOfBirth: '1990-05-15' },
  '987654321098': { name: 'Jane Smith', dateOfBirth: '1985-11-22' },
  '555555555555': { name: 'Raj Patel', dateOfBirth: '1992-03-30' },
  '111122223333': { name: 'Priya Singh', dateOfBirth: '1988-07-12' },
  '111111111111': { name: 'Test User', dateOfBirth: '1995-01-01' }
};

// Middleware to mock Aadhaar API response if the actual service is down
const mockAadhaarService = (req, res, next) => {
  // This middleware intercepts axios calls to the Aadhaar service
  const originalGet = axios.get;
  
  // Override axios.get to intercept calls to the Aadhaar API
  axios.get = async function(url, config) {
    // Check if the URL is for the Aadhaar service
    if (url.includes('/aadhaar/')) {
      try {
        // Try actual service first
        return await originalGet(url, config);
      } catch (error) {
        // If service is down, use mock data
        console.log('Aadhaar service down, using mock data');
        const aadhaarNumber = url.split('/').pop();
        if (mockAadhaarData[aadhaarNumber]) {
          return { data: mockAadhaarData[aadhaarNumber] };
        } else {
          const error = new Error('Aadhaar number not found');
          error.response = { status: 404 };
          throw error;
        }
      }
    }
    // For all other requests, use the original axios.get
    return originalGet(url, config);
  };
  
  next();
};

module.exports = { mockAadhaarService, mockAadhaarData };
