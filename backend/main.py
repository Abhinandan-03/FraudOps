from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .database import database
from .api import transactions, alerts, responses, metrics, leaderboard, multiplayer, auth
from .websocket.manager import manager
from .websocket.rooms import get_room
import os
import json
import asyncio

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

app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(alerts.router)
app.include_router(responses.router)
app.include_router(metrics.router)
app.include_router(leaderboard.router)
app.include_router(multiplayer.router)

@app.get("/")
def root():
    return {"message": "FraudOps Backend is running"}

@app.websocket("/ws/room/{room_code}/{player_id}")
async def websocket_room_endpoint(websocket: WebSocket, room_code: str, player_id: str):
    room = get_room(room_code)
    if not room:
        await websocket.close(code=1008)
        return

    # A simple mechanism to extract player name from query params could be useful,
    # but we'll accept it via the first CONNECT message for simplicity.
    await manager.connect(websocket)
    
    # Store reference so we can broadcast easily
    if not hasattr(manager, "room_connections"):
        manager.room_connections = {}
    if room_code not in manager.room_connections:
        manager.room_connections[room_code] = {}
        
    manager.room_connections[room_code][player_id] = websocket

    # Default name handling
    room.add_player(player_id, player_id)
    
    async def broadcast_room(event: str, data: dict):
        msg = {"event": event, "data": data}
        for pid, ws in manager.room_connections.get(room_code, {}).items():
            try:
                await ws.send_text(json.dumps(msg))
            except Exception:
                pass # Handled in disconnect
                
    await broadcast_room("ROOM_STATE", room.to_dict())

    try:
        while True:
            text = await websocket.receive_text()
            try:
                payload = json.loads(text)
                event = payload.get("event")
                data = payload.get("data", {})

                if event == "JOIN":
                    room.add_player(player_id, data.get("name", player_id))
                    await broadcast_room("ROOM_STATE", room.to_dict())
                    
                elif event == "PLAYER_READY":
                    room.set_player_ready(player_id, data.get("ready", True))
                    await broadcast_room("ROOM_STATE", room.to_dict())
                    
                elif event == "START_GAME":
                    if room.host_id == player_id and room.status == "LOBBY":
                        room.start_game()
                        await broadcast_room("GAME_STARTED", room.to_dict())
                        # Small delay for UI
                        await asyncio.sleep(1)
                        await broadcast_room("NEW_CASE", room.to_dict())
                        
                elif event == "SUBMIT_DECISION":
                    action = data.get("action")
                    if room.submit_decision(player_id, action):
                        await broadcast_room("PLAYER_SUBMITTED", {"player_id": player_id})
                        
                        if room.all_players_submitted():
                            room.resolve_case()
                            await broadcast_room("CASE_RESOLVED", room.get_result_dict())
                            
                elif event == "NEXT_CASE":
                    if room.host_id == player_id and room.status == "RESOLVED":
                        room.next_case()
                        await broadcast_room("NEW_CASE", room.to_dict())
                        
            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        room.remove_player(player_id)
        if room_code in manager.room_connections and player_id in manager.room_connections[room_code]:
            del manager.room_connections[room_code][player_id]
        manager.disconnect(websocket)
        await broadcast_room("ROOM_STATE", room.to_dict())
