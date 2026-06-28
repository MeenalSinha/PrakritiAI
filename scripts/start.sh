#!/bin/bash
# PrakritiAI – Quick Start Script

echo "============================================"
echo "  PrakritiAI – Natural Farming Assistant"
echo "============================================"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is required. Please install Python 3.9+"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is required. Please install Node.js 18+"
    exit 1
fi

# Setup .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file. Please add your API keys."
fi

# Install Python deps
echo ""
echo "Installing Python dependencies..."
pip install -r requirements.txt -q

# Install frontend deps
echo "Installing frontend dependencies..."
cd frontend && npm install -q && cd ..

# Start backend
echo ""
echo "Starting backend on http://localhost:8000 ..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
echo "Starting frontend on http://localhost:3000 ..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  PrakritiAI is running!"
echo "  Frontend: http://localhost:3000"
echo "  API Docs: http://localhost:8000/api/docs"
echo "  Press Ctrl+C to stop all services"
echo "============================================"

# Wait for both
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
