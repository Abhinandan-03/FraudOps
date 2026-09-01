from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import database
from ..database import models as database_models
from ..schemas import models

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=list[models.TransactionOut])
def get_transactions(db: Session = Depends(database.get_db)):
    transactions = db.query(database_models.Transaction).all()
    return transactions
