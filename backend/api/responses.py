from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import database
from ..database import models as database_models
from ..schemas import models
from ..scoring.engine import calculate_score
from ..websocket.manager import manager
import uuid

router = APIRouter(prefix="/alerts", tags=["responses"])

@router.post("/{alert_id}/respond", response_model=models.ActionResult)
def respond_to_alert(alert_id: str, response: models.ResponseCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    alert = db.query(database_models.Alert).filter(database_models.Alert.alert_id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    if alert.status == "RESPONDED":
        raise HTTPException(status_code=400, detail="Alert already responded to")
        
    transaction = alert.transaction
    if not transaction:
        raise HTTPException(status_code=500, detail="Associated transaction not found")
        
    session = db.query(database_models.Session).filter(database_models.Session.session_id == "player_1").first()
    if not session:
        # Create default session if it doesn't exist
        session = database_models.Session(session_id="player_1", player_name="Player 1")
        db.add(session)
        
    # Check freeze tokens
    if response.action == "FREEZE":
        if session.freeze_tokens <= 0:
            raise HTTPException(status_code=400, detail="No freeze tokens remaining")
        session.freeze_tokens -= 1
        
    # Scoring
    points, correct, multiplier, new_streak = calculate_score(
        ground_truth=transaction.ground_truth,
        player_action=response.action,
        response_ms=response.response_ms,
        current_streak=session.streak
    )
    
    # Update Session
    session.score += points
    session.streak = new_streak
    
    # Create Outcome
    post_response_outcome = "Fraud contained" if (correct and response.action == "FREEZE") else "Customer friction increased" if response.action == "STEP_UP_AUTH" else "No direct action"
    result_state = "POSITIVE" if correct else "NEGATIVE"
    
    outcome = database_models.Outcome(
        outcome_id=str(uuid.uuid4()),
        alert_id=alert_id,
        ground_truth=transaction.ground_truth,
        player_action=response.action,
        correct=correct,
        response_ms=response.response_ms,
        points=points,
        streak=new_streak,
        multiplier=multiplier,
        post_response_outcome=post_response_outcome,
        fraud_contained=(correct and response.action == "FREEZE")
    )
    db.add(outcome)
    
    # Record Response
    response_record = database_models.Response(
        response_id=str(uuid.uuid4()),
        alert_id=alert_id,
        action=response.action,
        response_ms=response.response_ms
    )
    db.add(response_record)
    
    alert.status = "RESPONDED"
    db.commit()
    
    # Trigger WebSocket event
    event_data = {
        "type": "SCORE_UPDATE",
        "score": session.score,
        "streak": session.streak,
        "multiplier": multiplier,
        "result_state": result_state
    }
    background_tasks.add_task(manager.broadcast, event_data)
    
    return models.ActionResult(
        correct=correct,
        points=points,
        streak=new_streak,
        multiplier=multiplier,
        result_state=result_state,
        post_response_outcome=post_response_outcome
    )
