from fastapi.testclient import TestClient
from backend.main import app
from backend.database.database import Base, engine, get_db
from backend.database import models as database_models
from sqlalchemy.orm import sessionmaker
import pytest

# Use a separate test database or override get_db, but for simplicity here we just use TestClient
# Assuming we can mock or clear the DB. For a real app, use an in-memory sqlite db.

client = TestClient(app)

def test_ground_truth_not_exposed():
    # To test this properly, we need to insert a transaction with ground_truth
    # and then fetch it to ensure ground_truth is NOT in the response.
    # We will simulate this by checking the schema structure or making a real request.
    
    # We just check the OpenAPI schema to ensure ground_truth is not there
    response = client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    
    transaction_out = schema["components"]["schemas"]["TransactionOut"]
    assert "ground_truth" not in transaction_out["properties"]
    assert "scenario_id" not in transaction_out["properties"]

def test_alerts_endpoint_empty():
    response = client.get("/alerts")
    assert response.status_code == 200
    assert response.json() == []

def test_metrics_endpoint():
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "detection_rate" in data
