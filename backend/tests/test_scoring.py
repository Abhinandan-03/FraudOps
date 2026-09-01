from backend.scoring.engine import calculate_score

def test_correct_freeze_on_fraud():
    points, correct, multiplier, streak = calculate_score("FRAUD", "FREEZE", 5000, 0)
    assert correct is True
    assert points == 100
    assert streak == 1

def test_correct_clear_on_legit():
    points, correct, multiplier, streak = calculate_score("LEGITIMATE", "CLEAR", 5000, 0)
    assert correct is True
    assert points == 50
    assert streak == 1

def test_false_positive_freeze():
    points, correct, multiplier, streak = calculate_score("LEGITIMATE", "FREEZE", 5000, 2)
    assert correct is False
    assert points == -75
    assert streak == 0

def test_missed_fraud():
    points, correct, multiplier, streak = calculate_score("FRAUD", "CLEAR", 5000, 5)
    assert correct is False
    assert points == -150
    assert streak == 0

def test_speed_multiplier_fast():
    points, correct, multiplier, streak = calculate_score("FRAUD", "FREEZE", 2000, 0)
    # fast response < 3000ms => multiplier 1.5
    assert multiplier == 1.5
    assert points == int(100 * 1.5)

def test_speed_multiplier_slow():
    points, correct, multiplier, streak = calculate_score("FRAUD", "FREEZE", 12000, 0)
    # slow response > 10000ms => multiplier 0.8
    assert multiplier == 0.8
    assert points == int(100 * 0.8)

def test_combo_multiplier():
    points, correct, multiplier, streak = calculate_score("FRAUD", "FREEZE", 5000, 2)
    # normal speed (1.0), previous streak 2 gives +0.2 combo bonus => 1.2
    assert round(multiplier, 2) == 1.2
    assert streak == 3
    assert points == int(100 * 1.2)
