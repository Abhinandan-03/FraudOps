from fastapi import APIRouter, HTTPException, Body
from backend.websocket.rooms import create_room, get_room

router = APIRouter(prefix="/rooms", tags=["multiplayer"])

@router.post("")
def api_create_room(host_id: str = Body(..., embed=True)):
    if not host_id:
        raise HTTPException(status_code=400, detail="host_id is required")
    room_code = create_room(host_id)
    return {"room_code": room_code}

@router.get("/{room_code}")
def api_get_room(room_code: str):
    room = get_room(room_code)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return room.to_dict()
