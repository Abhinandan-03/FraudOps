from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import database
from ..database import models as database_models
from ..schemas import models

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=list[models.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(database.get_db)):
    sessions = db.query(database_models.Session).order_by(database_models.Session.score.desc()).all()
    
    leaderboard = []
    for session in sessions:
        # Calculate some basic accuracy based on outcomes if we want
        # To keep it simple, we can just aggregate correctly or mock it based on streak
        # Let's actually calculate accuracy from outcomes for this session if we tracked it per session
        # Since outcomes don't track session_id directly, we'll assume a single-player global game for now
        outcomes = db.query(database_models.Outcome).all()
        total_alerts = len(outcomes)
        correct_decisions = sum(1 for o in outcomes if o.correct)
        accuracy = (correct_decisions / total_alerts) if total_alerts > 0 else 1.0
        
        average_response_time_ms = sum(o.response_ms for o in outcomes) / total_alerts if total_alerts > 0 else 0.0

        leaderboard.append(
            models.LeaderboardEntry(
                player_name=session.player_name,
                score=session.score,
                streak=session.streak,
                accuracy=accuracy,
                average_response_time_ms=average_response_time_ms
            )
        )
        
    return leaderboard
