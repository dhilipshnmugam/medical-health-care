# HealthPass - Healthcare Platform

HealthPass is a secure healthcare platform that provides QR-based medical IDs and digital prescription management. The application supports four user roles (Patient, Doctor, Medical Shop, and Admin) with different permissions and features.

## Features

- **Secure ID Verification**: Registration with government ID verification (Aadhaar, Driving License, Passport, etc.)
- **QR Code Medical ID**: Unique QR code for each patient's medical identity
- **Digital Prescriptions**: Paperless prescription from doctors to medical shops
- **Role-based Access Control**: Different interfaces for patients, doctors, medical shops, and administrators
- **Secure Authentication**: JWT-based authentication and authorization

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, JWT
- **Frontend**: React, React Router
- **QR Code**: qrcode.react for generation, @blackbox-vision/react-qr-reader for scanning
- **Authentication**: JWT token-based auth with role permissions

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/dhilipshnmugam/medical-health-care.git
   cd medical-health-care
   ```

2. Install dependencies for backend and frontend:
   ```
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthpass
   JWT_SECRET=your_jwt_secret
   ```

4. Start all services at once using the provided script:
   ```
   cd ..
   bash start-all.sh
   ```

   This will start:
   - Backend API server on port 5000
   - Frontend development server on port 3000

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Mock Aadhaar API: http://localhost:3001

## User Roles

1. **Patient**
   - Register with Aadhaar
   - View medical records and QR code
   - View prescriptions

2. **Doctor**
   - Scan patient QR codes
   - Create and manage prescriptions
   - View patient history

3. **Medical Shop**
   - Scan prescription QR codes
   - Verify and dispense medication
   - Mark prescriptions as fulfilled

4. **Admin**
   - Manage users
   - System configuration
   - View reports and analytics

## Project Structure

```
medical-health-care/
├── backend/               # Backend API
│   ├── controllers/       # API controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── mockAadhaar/       # Mock Aadhaar API
├── frontend/              # React frontend
│   ├── public/            # Public assets
│   └── src/               # React source code
│       ├── components/    # React components
│       └── App.js         # Main app component
└── start-all.sh           # Script to start all services
```

## License

This project is licensed under the MIT License.

## Contributors

- [dhilipshnmugam](https://github.com/dhilipshnmugam)