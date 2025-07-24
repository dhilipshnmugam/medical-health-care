#!/bin/bash
# Start the mock Aadhaar API
echo "Starting Mock Aadhaar API..."
cd /workspaces/medical-health-care/backend/mockAadhaar
npm install & npm start &

# Wait a bit for the mock API to start
sleep 2

# Start the backend server
echo "Starting Backend Server..."
cd /workspaces/medical-health-care/backend
npm install
npm run dev &

# Wait a bit for the backend to start
sleep 2

# Start the frontend
echo "Starting Frontend..."
cd /workspaces/medical-health-care/frontend
npm install --legacy-peer-deps
npm start &

echo "All services started!"
wait
