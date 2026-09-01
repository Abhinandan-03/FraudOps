# Mock interfaces for teammate integration

class DetectionService:
    @staticmethod
    def analyze_transaction(transaction: dict) -> dict:
        """
        Mock implementation for Vignesh's detection algorithms.
        Returns signals and risk score.
        """
        return {
            "signals": ["High transaction amount", "Unusual velocity"],
            "risk_score": 0.85,
            "severity": "HIGH"
        }

class GraphService:
    @staticmethod
    def get_connected_entities(account_id: str) -> dict:
        """
        Mock implementation for Farzain's graph/network analysis.
        Returns connected entities and narrative.
        """
        return {
            "connected_entities": [{"id": "ACC999", "type": "suspicious"}],
            "narrative": "Account shares device with known fraudulent entity."
        }

class ResponseService:
    @staticmethod
    def simulate_consequence(action: str, ground_truth: str) -> dict:
        """
        Mock implementation for Farzain's response simulation.
        Returns the consequence of the player's action.
        """
        if action == "FREEZE" and ground_truth == "FRAUD":
            return {"outcome": "Fraud contained", "loss_prevented": 1000.0}
        return {"outcome": "No action taken", "loss_prevented": 0.0}
