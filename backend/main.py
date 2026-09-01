from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .database import database
from .api import transactions, alerts, responses, metrics, leaderboard
from .websocket.manager import manager
import os

database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="FraudOps Backend API")

# Configure CORS for frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(alerts.router)
app.include_router(responses.router)
app.include_router(metrics.router)
app.include_router(leaderboard.router)

@app.get("/")
def root():
    return {"message": "FraudOps Backend is running"}

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keep connection alive, frontend may not send data here often
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
