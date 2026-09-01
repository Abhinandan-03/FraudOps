from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import database
from ..database import models as database_models
from ..schemas import models

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=list[models.AlertOut])
def get_alerts(db: Session = Depends(database.get_db)):
    alerts = db.query(database_models.Alert).all()
    return alerts

@router.get("/{alert_id}", response_model=models.AlertOut)
def get_alert(alert_id: str, db: Session = Depends(database.get_db)):
    alert = db.query(database_models.Alert).filter(database_models.Alert.alert_id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
