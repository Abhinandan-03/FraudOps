from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True, index=True)
    player_name = Column(String, index=True)
    score = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    freeze_tokens = Column(Integer, default=3)
    started_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    account_id = Column(String, index=True)
    device_id = Column(String)
    amount = Column(Float)
    timestamp = Column(String)
    location = Column(String)
    merchant_id = Column(String)
    scenario_id = Column(String)
    ground_truth = Column(String) # NEVER expose to frontend

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(String, primary_key=True, index=True)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"))
    severity = Column(String)
    risk_score = Column(Float)
    signals = Column(JSON) # List of strings
    narrative = Column(String)
    connected_entities = Column(JSON) # List of dicts or strings
    status = Column(String, default="OPEN") # OPEN, RESPONDED
    created_at = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())

    transaction = relationship("Transaction")
    responses = relationship("Response", back_populates="alert")
    outcomes = relationship("Outcome", back_populates="alert")

class Response(Base):
    __tablename__ = "responses"

    response_id = Column(String, primary_key=True, index=True)
    alert_id = Column(String, ForeignKey("alerts.alert_id"))
    action = Column(String) # CLEAR, STEP_UP_AUTH, FREEZE, ESCALATE
    timestamp = Column(String, default=lambda: datetime.now(timezone.utc).isoformat())
    response_ms = Column(Integer)

    alert = relationship("Alert", back_populates="responses")

class Outcome(Base):
    __tablename__ = "outcomes"

    outcome_id = Column(String, primary_key=True, index=True)
    alert_id = Column(String, ForeignKey("alerts.alert_id"))
    ground_truth = Column(String)
    player_action = Column(String)
    correct = Column(Boolean)
    response_ms = Column(Integer)
    points = Column(Integer)
    streak = Column(Integer)
    multiplier = Column(Float)
    post_response_outcome = Column(String)
    fraud_contained = Column(Boolean, default=False)
    loss_prevented = Column(Float, default=0.0)

    alert = relationship("Alert", back_populates="outcomes")
