from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import database
from ..database import models as database_models
from ..schemas import models

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=list[models.LeaderboardEntry])
def get_leaderboard(db: Session = Depends(database.get_db)):
    records = db.query(database_models.LeaderboardRecord).order_by(database_models.LeaderboardRecord.score.desc()).all()
    
    leaderboard = []
    for record in records:
        leaderboard.append(
            models.LeaderboardEntry(
                player_name=record.player_name,
                score=record.score,
                streak=record.best_streak,
                accuracy=record.accuracy,
                average_response_time_ms=record.average_response_time_ms,
                cases_played=record.cases_played,
                correct_decisions=record.correct_decisions,
                fraud_prevented=record.fraud_prevented,
                best_streak=record.best_streak,
                latest_game_time=record.latest_game_time
            )
        )
        
    return leaderboard

@router.post("/submit")
def submit_session(submission: models.SessionSubmission, db: Session = Depends(database.get_db)):
    from datetime import datetime, timezone

    # 1. Check if this session was already processed (we could use a Session model to track this, 
    # but since the frontend uses a mock generator and we don't store actual sessions on the backend yet,
    # we'll just allow upsert based on player_name and rely on the frontend to not duplicate. 
    # Ideally we'd log the session_id to prevent duplicates.)
    
    # 2. Validate score and stats
    calculated_score = 0
    calculated_fraud_prevented = 0.0
    correct_count = 0
    total_time_s = 0.0
    current_streak = 0
    best_streak = 0

    for outcome in submission.outcomes:
        calculated_score += outcome.points
        if outcome.correct:
            correct_count += 1
            calculated_fraud_prevented += outcome.fraudPrevented
            current_streak += 1
            if current_streak > best_streak:
                best_streak = current_streak
        else:
            current_streak = 0
        total_time_s += outcome.responseTime

    total_cases = len(submission.outcomes)
    
    if total_cases == 0:
        return {"status": "ignored", "reason": "No outcomes submitted"}

    # Calculate session accuracy and avg response
    session_accuracy = (correct_count / total_cases) * 100.0 if total_cases > 0 else 100.0
    session_avg_response_ms = (total_time_s / total_cases) * 1000.0 if total_cases > 0 else 0.0

    # 3. Upsert to LeaderboardRecord
    record = db.query(database_models.LeaderboardRecord).filter(database_models.LeaderboardRecord.player_name == submission.player_name).first()
    
    if record:
        # Update existing record
        # The user requested: "highest scores should be in leaderboard"
        if calculated_score > record.score:
            record.score = calculated_score
            # We can also update accuracy/response time to reflect their best game, or a cumulative average.
            # Let's reflect the stats of their best scoring game.
            record.accuracy = session_accuracy
            record.average_response_time_ms = session_avg_response_ms
            record.best_streak = max(record.best_streak, best_streak)
        
        # Cumulative stats
        record.cases_played += total_cases
        record.correct_decisions += correct_count
        record.fraud_prevented += calculated_fraud_prevented
        record.latest_game_time = datetime.now(timezone.utc).isoformat()
    else:
        # Create new record
        record = database_models.LeaderboardRecord(
            player_name=submission.player_name,
            score=calculated_score,
            cases_played=total_cases,
            correct_decisions=correct_count,
            accuracy=session_accuracy,
            average_response_time_ms=session_avg_response_ms,
            fraud_prevented=calculated_fraud_prevented,
            best_streak=best_streak,
            latest_game_time=datetime.now(timezone.utc).isoformat()
        )
        db.add(record)

    db.commit()
    db.refresh(record)

    return {"status": "success", "player": record.player_name, "score": record.score}

