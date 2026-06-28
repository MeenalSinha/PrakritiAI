import sys
import os

# Add the project root to sys.path so that 'backend' module is found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
