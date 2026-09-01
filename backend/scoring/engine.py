def calculate_score(
    ground_truth: str,
    player_action: str,
    response_ms: int,
    current_streak: int
) -> tuple[int, bool, float, int]:
    """
    Returns (points, correct, multiplier, new_streak)
    """
    correct = False
    base_points = 0
    
    # Ground truth mapping (assuming FRAUD or LEGITIMATE)
    is_fraud = ground_truth.upper() == "FRAUD"
    
    if is_fraud and player_action in ["FREEZE", "ESCALATE"]:
        correct = True
        base_points = 100
    elif not is_fraud and player_action == "CLEAR":
        correct = True
        base_points = 50
    elif not is_fraud and player_action in ["FREEZE", "ESCALATE"]:
        # False positive
        correct = False
        base_points = -75
    elif is_fraud and player_action == "CLEAR":
        # Missed fraud
        correct = False
        base_points = -150
    elif player_action == "STEP_UP_AUTH":
        # Neutral action - doesn't affect score much but costs time
        correct = True # treated as safe action
        base_points = 10
        
    # Speed multiplier
    multiplier = 1.0
    if response_ms < 3000:
        multiplier = 1.5
    elif response_ms > 10000:
        multiplier = 0.8
        
    if not correct:
        multiplier = 1.0 # No multiplier on negative points
        
    # Calculate streak
    new_streak = current_streak + 1 if correct else 0
    
    # Combo multiplier based on consecutive streak beyond the first correct answer
    combo_bonus = min(0.1 * current_streak, 1.0) if correct else 0.0
    final_multiplier = round(multiplier + combo_bonus, 2)
    
    final_points = int(base_points * final_multiplier) if base_points > 0 else base_points
    
    return final_points, correct, final_multiplier, new_streak
