@echo off
echo Setting up MongoDB for Book Review Platform...

echo.
echo Option 1: Install MongoDB Community Server
echo 1. Download from: https://www.mongodb.com/try/download/community
echo 2. Install MongoDB Community Server
echo 3. Start MongoDB service
echo.

echo Option 2: Use MongoDB Atlas (Cloud)
echo 1. Go to: https://cloud.mongodb.com/
echo 2. Add your IP address to Network Access
echo 3. Update backend/config.env with your Atlas URI
echo.

echo Option 3: Use Docker (if you have Docker installed)
echo docker run -d -p 27017:27017 --name mongodb mongo:latest
echo.

echo After setting up MongoDB, run:
echo cd backend
echo node server.js
echo.
pause
