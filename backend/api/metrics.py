from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import database
from ..database import models as database_models
from ..schemas import models

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/", response_model=models.MetricsOut)
def get_metrics(db: Session = Depends(database.get_db)):
    outcomes = db.query(database_models.Outcome).all()
    
    total_alerts = len(outcomes)
    correct_decisions = sum(1 for o in outcomes if o.correct)
    incorrect_decisions = total_alerts - correct_decisions
    
    # Calculate True Positives, False Positives, False Negatives, True Negatives
    true_positives = sum(1 for o in outcomes if o.ground_truth.upper() == "FRAUD" and o.player_action in ["FREEZE", "ESCALATE"])
    false_positives = sum(1 for o in outcomes if o.ground_truth.upper() != "FRAUD" and o.player_action in ["FREEZE", "ESCALATE"])
    false_negatives = sum(1 for o in outcomes if o.ground_truth.upper() == "FRAUD" and o.player_action == "CLEAR")
    
    detection_rate = (true_positives / (true_positives + false_negatives)) if (true_positives + false_negatives) > 0 else 0.0
    false_positive_rate = (false_positives / total_alerts) if total_alerts > 0 else 0.0
    
    average_response_time_ms = sum(o.response_ms for o in outcomes) / total_alerts if total_alerts > 0 else 0.0
    
    fraud_contained = sum(1 for o in outcomes if o.fraud_contained)
    loss_prevented = sum(o.loss_prevented for o in outcomes if o.loss_prevented is not None)
    
    # Calculate total score from sessions
    total_score = db.query(func.sum(database_models.Session.score)).scalar() or 0

    return models.MetricsOut(
        detection_rate=detection_rate,
        false_positive_rate=false_positive_rate,
        average_response_time_ms=average_response_time_ms,
        fraud_contained=fraud_contained,
        loss_prevented=loss_prevented,
        total_alerts=total_alerts,
        correct_decisions=correct_decisions,
        incorrect_decisions=incorrect_decisions,
        total_score=total_score
    )
