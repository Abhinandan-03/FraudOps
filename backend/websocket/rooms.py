import uuid
import time
from typing import Dict, Any, List
from backend.services.cases import get_case, get_client_case
from backend.database.database import SessionLocal
from backend.database import models

# Memory store for active rooms
active_rooms: Dict[str, 'Room'] = {}

class Room:
    def __init__(self, room_id: str, host_id: str):
        self.room_id = room_id
        self.host_id = host_id
        self.players: Dict[str, Dict[str, Any]] = {}
        self.status = "LOBBY" # LOBBY, PLAYING, RESOLVED
        self.case_index = 0
        self.current_full_case = None
        self.current_client_case = None
        self.case_start_time = 0

    def add_player(self, player_id: str, player_name: str):
        if player_id not in self.players:
            self.players[player_id] = {
                "id": player_id,
                "name": player_name,
                "ready": False,
                "score": 0,
                "streak": 0,
                "action": None,
                "response_time": None,
                "points_earned": 0,
                "correct": None,
                "connected": True
            }
        else:
            self.players[player_id]["connected"] = True
            
    def remove_player(self, player_id: str):
        if player_id in self.players:
            self.players[player_id]["connected"] = False
            # If it's the host, migrate host to someone connected
            if self.host_id == player_id:
                for pid, pdata in self.players.items():
                    if pdata["connected"]:
                        self.host_id = pid
                        break

    def set_player_ready(self, player_id: str, ready: bool):
        if player_id in self.players:
            self.players[player_id]["ready"] = ready

    def start_game(self):
        self.status = "PLAYING"
        self._generate_next_case()

    def _generate_next_case(self):
        self.current_full_case = get_case(self.case_index)
        self.current_client_case = get_client_case(self.current_full_case)
        self.case_start_time = time.time()
        self.status = "PLAYING"
        
        # Reset player actions
        for p in self.players.values():
            p["action"] = None
            p["response_time"] = None
            p["points_earned"] = 0
            p["correct"] = None

    def submit_decision(self, player_id: str, action: str):
        if self.status != "PLAYING" or player_id not in self.players:
            return False
            
        player = self.players[player_id]
        if player["action"] is not None:
            return False # already submitted
            
        player["action"] = action
        player["response_time"] = time.time() - self.case_start_time
        return True

    def all_players_submitted(self) -> bool:
        active_players = [p for p in self.players.values() if p["connected"]]
        if not active_players:
            return False
        return all(p["action"] is not None for p in active_players)

    def resolve_case(self):
        self.status = "RESOLVED"
        ground_truth = self.current_full_case["groundTruth"]
        
        db = SessionLocal()
        try:
            for player_id, player in self.players.items():
                if not player["connected"] or player["action"] is None:
                    continue
                    
                is_correct = player["action"].upper() in [a.upper() for a in ground_truth["allowedActions"]]
                player["correct"] = is_correct
                
                # Authoritative scoring
                if is_correct:
                    points = ground_truth["correctOutcome"]["points"]
                    player["streak"] += 1
                else:
                    points = ground_truth["wrongOutcome"]["points"]
                    player["streak"] = 0
                    
                player["points_earned"] = points
                player["score"] = max(0, player["score"] + points)
                
                # Persist to database for leaderboard
                db_session = db.query(models.Session).filter(models.Session.session_id == player_id).first()
                if not db_session:
                    db_session = models.Session(session_id=player_id, player_name=player["name"], score=0, streak=0)
                    db.add(db_session)
                
                db_session.score = player["score"]
                db_session.streak = max(db_session.streak, player["streak"]) # tracking max streak in DB
                db_session.player_name = player["name"]
                
                # Add outcome for accuracy
                outcome = models.Outcome(
                    outcome_id=f"{self.room_id}_{player_id}_{self.case_index}",
                    alert_id=self.current_full_case.get("id", "CASE_0"),
                    ground_truth=ground_truth["correctAction"],
                    player_action=player["action"],
                    correct=is_correct,
                    response_ms=int(player["response_time"] * 1000) if player["response_time"] else 0,
                    points=points,
                    streak=player["streak"],
                    multiplier=1.0,
                    post_response_outcome=ground_truth["correctOutcome"]["outcome"] if is_correct else ground_truth["wrongOutcome"]["outcome"],
                    fraud_contained=is_correct,
                    loss_prevented=ground_truth.get("fraudAmount", 0) if is_correct else 0
                )
                db.add(outcome)
            
            db.commit()
        except Exception as e:
            print("Error persisting to DB:", e)
            db.rollback()
        finally:
            db.close()
            
        self.case_index += 1

    def next_case(self):
        self._generate_next_case()

    def to_dict(self):
        return {
            "room_id": self.room_id,
            "host_id": self.host_id,
            "status": self.status,
            "players": list(self.players.values()),
            "current_case": self.current_client_case if self.status == "PLAYING" else None
        }

    def get_result_dict(self):
        ground_truth = self.current_full_case.get("groundTruth", {}) if self.current_full_case else {}
        return {
            "room_id": self.room_id,
            "status": self.status,
            "ground_truth_action": ground_truth.get("correctAction"),
            "players": list(self.players.values()),
        }

def create_room(host_id: str) -> str:
    room_id = str(uuid.uuid4())[:5].upper()
    active_rooms[room_id] = Room(room_id, host_id)
    return room_id

def get_room(room_id: str) -> Room:
    return active_rooms.get(room_id)
