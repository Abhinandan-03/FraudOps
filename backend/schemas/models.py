from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class TransactionBase(BaseModel):
    transaction_id: str
    account_id: str
    device_id: str
    amount: float
    timestamp: str
    location: str
    merchant_id: str

class TransactionOut(TransactionBase):
    pass
    # Intentionally missing ground_truth and scenario_id

class TransactionCreate(TransactionBase):
    scenario_id: str
    ground_truth: str

class AlertBase(BaseModel):
    alert_id: str
    transaction_id: str
    severity: str
    risk_score: float
    signals: List[str]
    narrative: str
    connected_entities: List[Any]

class AlertOut(AlertBase):
    status: str
    created_at: str

class ResponseCreate(BaseModel):
    action: str # CLEAR, STEP_UP_AUTH, FREEZE, ESCALATE
    response_ms: int = 0

class ActionResult(BaseModel):
    correct: bool
    points: int
    streak: int
    multiplier: float
    result_state: str # POSITIVE, NEGATIVE
    post_response_outcome: str

class ScoreUpdateEvent(BaseModel):
    type: str = "SCORE_UPDATE"
    score: int
    streak: int
    multiplier: float

class SessionOut(BaseModel):
    session_id: str
    player_name: str
    score: int
    streak: int
    freeze_tokens: int

class MetricsOut(BaseModel):
    detection_rate: float
    false_positive_rate: float
    average_response_time_ms: float
    fraud_contained: int
    loss_prevented: float
    total_alerts: int
    correct_decisions: int
    incorrect_decisions: int
    total_score: int

class LeaderboardEntry(BaseModel):
    player_name: str
    score: int
    streak: int = 0
    accuracy: float
    average_response_time_ms: float
    cases_played: int = 0
    correct_decisions: int = 0
    fraud_prevented: float = 0.0
    best_streak: int = 0
    latest_game_time: Optional[str] = None

class CaseOutcome(BaseModel):
    caseId: str
    action: str
    correct: bool
    points: int
    responseTime: float
    fraudPrevented: float = 0.0

class SessionSubmission(BaseModel):
    session_id: str
    player_name: str
    outcomes: List[CaseOutcome]
    difficulty: str = "ELITE"

