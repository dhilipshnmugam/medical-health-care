#!/bin/bash

# This script runs the application with in-memory data for development purposes
# No MongoDB connection is required

# Set environment variables
export USE_MOCK_DATA=true
export NODE_ENV=development

echo "Starting HealthPass in development mode with mock data..."

# Create necessary directories if they don't exist
mkdir -p /tmp/healthpass

# Kill any existing processes using our ports
echo "Checking for existing services..."
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 5000/tcp 2>/dev/null || true

# Wait a moment to ensure ports are freed
sleep 1

# We no longer need the mock Aadhaar API
echo "Starting in development mode with mock data..."
sleep 1

# Start the backend server with mock data
echo "Starting Backend Server with mock data on port 5000..."
cd /workspaces/medical-health-care/backend

# Update environment variables to use in-memory storage
export USE_MOCK_DATA=true
export MONGO_URI=null

npm install > /tmp/healthpass/backend-install.log 2>&1
node server.js > /tmp/healthpass/backend.log 2>&1 &

# Wait a bit for the backend to start
echo "Waiting for Backend API to start..."
sleep 3

# Start the frontend
echo "Starting Frontend on port 3000..."
cd /workspaces/medical-health-care/frontend
npm install --legacy-peer-deps > /tmp/healthpass/frontend-install.log 2>&1
npm start > /tmp/healthpass/frontend.log 2>&1 &

# Wait a bit for the frontend to start
echo "Waiting for Frontend to start..."
sleep 3

echo ""
echo "All services should be starting now!"
echo ""
echo "HealthPass is now running:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:5000"
echo ""
echo "Test user accounts:"
echo "- Patient: john@example.com"
echo "- Doctor: jane@example.com"
echo "- Medical Shop: shop@example.com"
echo "- Admin: admin@example.com"
echo ""
echo "If you encounter issues, check the logs:"
echo "- Backend API: /tmp/healthpass/backend.log"
echo "- Frontend: /tmp/healthpass/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"

wait

echo "All services started in development mode with mock data!"
wait
