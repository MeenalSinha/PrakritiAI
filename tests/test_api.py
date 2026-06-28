import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_register_and_login():
    # 1. Register a new user
    register_data = {
        "name": "Test Farmer",
        "phone": "9999999999",
        "password": "testpassword",
        "state": "Maharashtra",
        "district": "Pune",
        "preferred_language": "hi"
    }
    
    response = client.post("/api/v1/auth/register", json=register_data)
    # 200 if new, 400 if already exists
    assert response.status_code in [200, 400]

    # 2. Login
    login_data = {
        "phone": "9999999999",
        "password": "testpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    
    # Check that HttpOnly cookie was set
    assert "access_token" in response.cookies

    # 3. Access protected route
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    assert response.json()["phone"] == "9999999999"

def test_guest_login():
    response = client.post("/api/v1/auth/guest", json={
        "name": "Guest",
        "state": "Haryana",
        "preferred_language": "en"
    })
    assert response.status_code == 200
    assert response.json()["is_guest"] is True
    assert "access_token" in response.cookies
