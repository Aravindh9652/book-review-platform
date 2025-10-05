@echo off
echo Starting Book Review Platform...

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && node server-memory.js"

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm start"

echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Open your browser and go to: http://localhost:3000
pause
