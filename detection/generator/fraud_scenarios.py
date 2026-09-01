"""
Fraud Scenario Injection Module for FraudOps.

Provides deterministic, behavior-based fraud attack scenarios that can be injected
into synthetic transaction streams for simulation, training, and detection benchmarking.
"""

from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Callable, Dict, List, Optional
import random

from detection.generator.models import (
    AccountProfile,
    AccountProfileType,
    Transaction,
    TransactionType,
)
from detection.generator.transaction_generator import TransactionGenerator


class ScenarioType(str, Enum):
    """Supported fraud attack scenario types."""
    HIGH_VELOCITY = "HIGH_VELOCITY"
    HIGH_AMOUNT = "HIGH_AMOUNT"
    GEO_MISMATCH = "GEO_MISMATCH"
    ACCOUNT_TAKEOVER = "ACCOUNT_TAKEOVER"
    RAPID_FUND_MOVEMENT = "RAPID_FUND_MOVEMENT"
    MULTI_ACCOUNT_CHAIN = "MULTI_ACCOUNT_CHAIN"
    FAN_OUT = "FAN_OUT"


# -----------------------------------------------------------------------------
# Scenario Builders
# -----------------------------------------------------------------------------

def _build_high_velocity_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    burst_count: int = 8,
    account_id: Optional[str] = None,
    **kwargs: Any
) -> List[Transaction]:
    """
    HIGH_VELOCITY: Multiple rapid transactions from the same account in a few seconds.
    Simulates automated script attacks or card testing.
    """
    accounts = generator.get_all_accounts()
    target_account = generator.get_account(account_id) if account_id else rng.choice(accounts)
    merchants = generator.get_all_merchants()

    transactions: List[Transaction] = []
    current_time = start_time

    for i in range(1, burst_count + 1):
        # 0.2 to 1.2 seconds between rapid requests
        step_ms = rng.randint(200, 1200)
        current_time += timedelta(milliseconds=step_ms)
        merch = rng.choice(merchants)
        amount = round(rng.uniform(15.0, 95.0), 2)
        tx_id = f"tx-fraud-vel-{i:03d}-{rng.randint(1000, 9999)}"

        tx = Transaction(
            transaction_id=tx_id,
            timestamp=current_time.isoformat(),
            sender_account_id=target_account.account_id,
            receiver_account_id=merch.merchant_id,
            amount=amount,
            currency=generator.config.currency,
            merchant_id=merch.merchant_id,
            device_id=target_account.primary_device_id,
            ip_address=f"{target_account.primary_ip_prefix}{rng.randint(10, 250)}",
            location=target_account.base_location,
            transaction_type=TransactionType.PURCHASE.value,
            is_fraud_scenario=True,
            scenario_id=ScenarioType.HIGH_VELOCITY.value,
            metadata={
                "burst_index": i,
                "burst_total": burst_count,
                "time_delta_ms": step_ms,
                "attack_pattern": "RAPID_CARD_TESTING"
            }
        )
        transactions.append(tx)

    return transactions


def _build_high_amount_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    account_id: Optional[str] = None,
    multiplier: float = 25.0,
    **kwargs: Any
) -> List[Transaction]:
    """
    HIGH_AMOUNT: Transaction amount significantly higher than account baseline.
    Simulates unauthorized large wire or whale card drain.
    """
    accounts = generator.get_all_accounts()
    # Pick a low-value or retail account for high contrast baseline
    if account_id:
        target_account = generator.get_account(account_id) or accounts[0]
    else:
        candidates = [a for a in accounts if a.profile_type in (AccountProfileType.LOW_VALUE_FREQUENT, AccountProfileType.NORMAL_RETAIL)]
        target_account = rng.choice(candidates) if candidates else rng.choice(accounts)

    merchants = generator.get_all_merchants()
    merchant = rng.choice(merchants)

    # Spike amount well beyond account's normal max
    spike_amount = round(target_account.mean_amount * multiplier + rng.uniform(500.0, 2000.0), 2)
    spike_amount = max(spike_amount, 7500.0)

    current_time = start_time + timedelta(seconds=1)
    tx_id = f"tx-fraud-amt-{rng.randint(10000, 99999)}"

    tx = Transaction(
        transaction_id=tx_id,
        timestamp=current_time.isoformat(),
        sender_account_id=target_account.account_id,
        receiver_account_id=merchant.merchant_id,
        amount=spike_amount,
        currency=generator.config.currency,
        merchant_id=merchant.merchant_id,
        device_id=target_account.primary_device_id,
        ip_address=f"{target_account.primary_ip_prefix}{rng.randint(2, 254)}",
        location=target_account.base_location,
        transaction_type=TransactionType.PURCHASE.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.HIGH_AMOUNT.value,
        metadata={
            "account_mean_baseline": target_account.mean_amount,
            "account_max_baseline": target_account.max_amount,
            "amount_multiplier": round(spike_amount / target_account.mean_amount, 1),
            "attack_pattern": "AMOUNT_ANOMALY_DRAIN"
        }
    )

    return [tx]


def _build_geo_mismatch_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    account_id: Optional[str] = None,
    **kwargs: Any
) -> List[Transaction]:
    """
    GEO_MISMATCH: Account performs a normal transaction from home location,
    followed moments later by a transaction from an impossible foreign location.
    Simulates session hijacking or stolen credentials used across continents.
    """
    accounts = generator.get_all_accounts()
    target_account = generator.get_account(account_id) if account_id else rng.choice(accounts)
    merchants = generator.get_all_merchants()

    foreign_locations = ["RU-MSK", "CN-BJ", "RO-BUC", "NG-LOS", "BR-SAO", "IR-THR"]
    chosen_foreign_loc = rng.choice([loc for loc in foreign_locations if loc != target_account.base_location])
    foreign_ip = f"185.220.{rng.randint(100, 200)}.{rng.randint(2, 254)}"  # Typical Tor / proxy block

    # 1. First legitimate baseline transaction
    t1_time = start_time
    t1_merch = rng.choice(merchants)
    tx1 = Transaction(
        transaction_id=f"tx-fraud-geo-1-{rng.randint(1000, 9999)}",
        timestamp=t1_time.isoformat(),
        sender_account_id=target_account.account_id,
        receiver_account_id=t1_merch.merchant_id,
        amount=round(rng.uniform(20.0, 60.0), 2),
        currency=generator.config.currency,
        merchant_id=t1_merch.merchant_id,
        device_id=target_account.primary_device_id,
        ip_address=f"{target_account.primary_ip_prefix}{rng.randint(2, 250)}",
        location=target_account.base_location,
        transaction_type=TransactionType.PURCHASE.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.GEO_MISMATCH.value,
        metadata={
            "leg": "HOME_BASE_ORIGIN",
            "country_code": target_account.base_location
        }
    )

    # 2. Impossible travel second transaction 45 seconds later
    t2_time = t1_time + timedelta(seconds=rng.randint(30, 90))
    t2_merch = rng.choice(merchants)
    tx2 = Transaction(
        transaction_id=f"tx-fraud-geo-2-{rng.randint(1000, 9999)}",
        timestamp=t2_time.isoformat(),
        sender_account_id=target_account.account_id,
        receiver_account_id=t2_merch.merchant_id,
        amount=round(rng.uniform(450.0, 1800.0), 2),
        currency=generator.config.currency,
        merchant_id=t2_merch.merchant_id,
        device_id=target_account.primary_device_id,
        ip_address=foreign_ip,
        location=chosen_foreign_loc,
        transaction_type=TransactionType.PURCHASE.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.GEO_MISMATCH.value,
        metadata={
            "leg": "IMPOSSIBLE_TRAVEL_HOP",
            "home_location": target_account.base_location,
            "anomalous_location": chosen_foreign_loc,
            "travel_window_seconds": (t2_time - t1_time).total_seconds(),
            "proxy_ip_used": foreign_ip
        }
    )

    return [tx1, tx2]


def _build_account_takeover_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    account_id: Optional[str] = None,
    **kwargs: Any
) -> List[Transaction]:
    """
    ACCOUNT_TAKEOVER: Unrecognized rogue device & IP performs authentication delta,
    followed by high-risk funds exfiltration to a mule account.
    """
    accounts = generator.get_all_accounts()
    victim = generator.get_account(account_id) if account_id else rng.choice(accounts)
    other_accounts = [a for a in accounts if a.account_id != victim.account_id]
    mule_account = rng.choice(other_accounts) if other_accounts else accounts[0]

    rogue_device_id = f"dev-rogue-{rng.randint(1000, 9999)}"
    rogue_ip = f"194.135.{rng.randint(10, 99)}.{rng.randint(2, 254)}"
    foreign_loc = rng.choice(["DE-BER", "RO-BUC", "RU-MSK", "NL-AMS"])

    transactions: List[Transaction] = []
    current_time = start_time

    # Step 1: Probe / token check
    t1_time = current_time + timedelta(seconds=2)
    tx1 = Transaction(
        transaction_id=f"tx-fraud-ato-probe-{rng.randint(1000, 9999)}",
        timestamp=t1_time.isoformat(),
        sender_account_id=victim.account_id,
        receiver_account_id=mule_account.account_id,
        amount=1.00,
        currency=generator.config.currency,
        device_id=rogue_device_id,
        ip_address=rogue_ip,
        location=foreign_loc,
        transaction_type=TransactionType.TRANSFER.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.ACCOUNT_TAKEOVER.value,
        metadata={
            "ato_stage": "PROBE_VERIFICATION",
            "recognized_device": False,
            "rogue_device_id": rogue_device_id
        }
    )
    transactions.append(tx1)

    # Step 2: Major balance exfiltration transfer
    t2_time = t1_time + timedelta(seconds=12)
    drain_amount = round(rng.uniform(3200.0, 9800.0), 2)
    tx2 = Transaction(
        transaction_id=f"tx-fraud-ato-drain-{rng.randint(1000, 9999)}",
        timestamp=t2_time.isoformat(),
        sender_account_id=victim.account_id,
        receiver_account_id=mule_account.account_id,
        amount=drain_amount,
        currency=generator.config.currency,
        device_id=rogue_device_id,
        ip_address=rogue_ip,
        location=foreign_loc,
        transaction_type=TransactionType.TRANSFER.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.ACCOUNT_TAKEOVER.value,
        metadata={
            "ato_stage": "EXFILTRATION_DRAIN",
            "recognized_device": False,
            "mule_destination": mule_account.account_id
        }
    )
    transactions.append(tx2)

    return transactions


def _build_rapid_fund_movement_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    initial_amount: float = 8500.0,
    **kwargs: Any
) -> List[Transaction]:
    """
    RAPID_FUND_MOVEMENT: Funds arrive in Account A and are immediately (within seconds)
    relayed to Account B, and then quickly forwarded to Account C.
    Simulates rapid mule pass-through to prevent recovery.
    """
    accounts = generator.get_all_accounts()
    if len(accounts) < 3:
        raise ValueError("RAPID_FUND_MOVEMENT requires at least 3 accounts in generator.")

    selected = rng.sample(accounts, 3)
    acc_a, acc_b, acc_c = selected[0], selected[1], selected[2]

    transactions: List[Transaction] = []
    current_time = start_time

    # Leg 1: Deposit into Acc A
    t1_time = current_time + timedelta(seconds=1)
    amt_1 = initial_amount
    tx1 = Transaction(
        transaction_id=f"tx-fraud-rfm-leg1-{rng.randint(1000, 9999)}",
        timestamp=t1_time.isoformat(),
        sender_account_id=acc_a.account_id,
        receiver_account_id=acc_b.account_id,
        amount=amt_1,
        currency=generator.config.currency,
        device_id=acc_a.primary_device_id,
        ip_address=f"{acc_a.primary_ip_prefix}{rng.randint(2, 250)}",
        location=acc_a.base_location,
        transaction_type=TransactionType.TRANSFER.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.RAPID_FUND_MOVEMENT.value,
        metadata={
            "hop": 1,
            "total_hops": 2,
            "retained_fraction": 1.0,
            "relay_pattern": "PASS_THROUGH"
        }
    )
    transactions.append(tx1)

    # Leg 2: Immediate pass-through from Acc B to Acc C (3 seconds later, 96% of amount)
    t2_time = t1_time + timedelta(seconds=rng.randint(2, 5))
    amt_2 = round(amt_1 * 0.96, 2)
    tx2 = Transaction(
        transaction_id=f"tx-fraud-rfm-leg2-{rng.randint(1000, 9999)}",
        timestamp=t2_time.isoformat(),
        sender_account_id=acc_b.account_id,
        receiver_account_id=acc_c.account_id,
        amount=amt_2,
        currency=generator.config.currency,
        device_id=acc_b.primary_device_id,
        ip_address=f"{acc_b.primary_ip_prefix}{rng.randint(2, 250)}",
        location=acc_b.base_location,
        transaction_type=TransactionType.TRANSFER.value,
        is_fraud_scenario=True,
        scenario_id=ScenarioType.RAPID_FUND_MOVEMENT.value,
        metadata={
            "hop": 2,
            "total_hops": 2,
            "retained_fraction": 0.96,
            "relay_pattern": "PASS_THROUGH_CASHOUT"
        }
    )
    transactions.append(tx2)

    return transactions


def _build_multi_account_chain_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    chain_length: int = 4,
    initial_amount: float = 9800.0,
    **kwargs: Any
) -> List[Transaction]:
    """
    MULTI_ACCOUNT_CHAIN: Structured layering chain: A -> B -> C -> D -> ...
    Transactions happen in close chronological succession with structuring / fee shaving.
    """
    accounts = generator.get_all_accounts()
    if len(accounts) < chain_length:
        raise ValueError(
            f"MULTI_ACCOUNT_CHAIN of length {chain_length} requires at least {chain_length} accounts in generator."
        )

    chain_accounts = rng.sample(accounts, chain_length)
    transactions: List[Transaction] = []
    current_time = start_time
    current_amount = initial_amount

    for hop in range(chain_length - 1):
        sender = chain_accounts[hop]
        receiver = chain_accounts[hop + 1]

        # Step time forward by 5-15 seconds per hop
        current_time += timedelta(seconds=rng.randint(5, 15))
        tx_id = f"tx-fraud-chain-hop{hop+1}-{rng.randint(1000, 9999)}"

        tx = Transaction(
            transaction_id=tx_id,
            timestamp=current_time.isoformat(),
            sender_account_id=sender.account_id,
            receiver_account_id=receiver.account_id,
            amount=round(current_amount, 2),
            currency=generator.config.currency,
            device_id=sender.primary_device_id,
            ip_address=f"{sender.primary_ip_prefix}{rng.randint(2, 250)}",
            location=sender.base_location,
            transaction_type=TransactionType.TRANSFER.value,
            is_fraud_scenario=True,
            scenario_id=ScenarioType.MULTI_ACCOUNT_CHAIN.value,
            metadata={
                "hop_index": hop + 1,
                "total_chain_hops": chain_length - 1,
                "layering_chain": [a.account_id for a in chain_accounts]
            }
        )
        transactions.append(tx)
        # Deduct small laundering cut (2-4%) for next hop
        current_amount = current_amount * rng.uniform(0.96, 0.98)

    return transactions


def _build_fan_out_scenario(
    generator: TransactionGenerator,
    rng: random.Random,
    start_time: datetime,
    target_count: int = 7,
    source_account_id: Optional[str] = None,
    total_amount: float = 14000.0,
    **kwargs: Any
) -> List[Transaction]:
    """
    FAN_OUT: Single source account rapidly distributes funds to multiple recipient accounts.
    Simulates smurfing, mule distribution, or syndicate dispersion.
    """
    accounts = generator.get_all_accounts()
    if len(accounts) < target_count + 1:
        raise ValueError(
            f"FAN_OUT to {target_count} targets requires at least {target_count + 1} accounts in generator."
        )

    source = generator.get_account(source_account_id) if source_account_id else rng.choice(accounts)
    available_recipients = [a for a in accounts if a.account_id != source.account_id]
    recipients = rng.sample(available_recipients, target_count)

    transactions: List[Transaction] = []
    current_time = start_time
    slice_amount = round(total_amount / target_count, 2)

    for i, recipient in enumerate(recipients, start=1):
        # 2 to 8 seconds apart
        current_time += timedelta(seconds=rng.randint(2, 8))
        # Small variance in smurfing amount
        amt = round(slice_amount * rng.uniform(0.92, 1.08), 2)
        tx_id = f"tx-fraud-fanout-{i:02d}-{rng.randint(1000, 9999)}"

        tx = Transaction(
            transaction_id=tx_id,
            timestamp=current_time.isoformat(),
            sender_account_id=source.account_id,
            receiver_account_id=recipient.account_id,
            amount=amt,
            currency=generator.config.currency,
            device_id=source.primary_device_id,
            ip_address=f"{source.primary_ip_prefix}{rng.randint(2, 250)}",
            location=source.base_location,
            transaction_type=TransactionType.TRANSFER.value,
            is_fraud_scenario=True,
            scenario_id=ScenarioType.FAN_OUT.value,
            metadata={
                "fan_index": i,
                "fan_total_recipients": target_count,
                "source_hub": source.account_id,
                "dispersion_pattern": "SMURFING_DISTRIBUTION"
            }
        )
        transactions.append(tx)

    return transactions


# Registry mapping scenario names to builder functions
SCENARIO_BUILDERS: Dict[str, Callable[..., List[Transaction]]] = {
    ScenarioType.HIGH_VELOCITY.value: _build_high_velocity_scenario,
    ScenarioType.HIGH_AMOUNT.value: _build_high_amount_scenario,
    ScenarioType.GEO_MISMATCH.value: _build_geo_mismatch_scenario,
    ScenarioType.ACCOUNT_TAKEOVER.value: _build_account_takeover_scenario,
    ScenarioType.RAPID_FUND_MOVEMENT.value: _build_rapid_fund_movement_scenario,
    ScenarioType.MULTI_ACCOUNT_CHAIN.value: _build_multi_account_chain_scenario,
    ScenarioType.FAN_OUT.value: _build_fan_out_scenario,
}

SCENARIO_METADATA: Dict[str, Dict[str, Any]] = {
    ScenarioType.HIGH_VELOCITY.value: {
        "description": "Rapid burst of transactions from a single account in seconds (card testing).",
        "primary_signals": ["VELOCITY_SPIKE", "RAPID_FIRE_FREQUENCY"],
        "default_tx_count": 8,
    },
    ScenarioType.HIGH_AMOUNT.value: {
        "description": "Extreme spending spike far beyond user normal historical baseline.",
        "primary_signals": ["AMOUNT_ANOMALY", "BASELINE_DEVIATION"],
        "default_tx_count": 1,
    },
    ScenarioType.GEO_MISMATCH.value: {
        "description": "Simultaneous or impossible speed travel between geographic locations.",
        "primary_signals": ["IMPOSSIBLE_TRAVEL", "FOREIGN_IP_PROXY"],
        "default_tx_count": 2,
    },
    ScenarioType.ACCOUNT_TAKEOVER.value: {
        "description": "Unrecognized device & IP login followed immediately by balance exfiltration.",
        "primary_signals": ["DEVICE_ANOMALY", "ATO_DRAIN_PATTERN"],
        "default_tx_count": 2,
    },
    ScenarioType.RAPID_FUND_MOVEMENT.value: {
        "description": "Rapid high-value pass-through where incoming deposit is moved within seconds.",
        "primary_signals": ["RAPID_RELAY", "MULE_PASS_THROUGH"],
        "default_tx_count": 2,
    },
    ScenarioType.MULTI_ACCOUNT_CHAIN.value: {
        "description": "Layering chain through A -> B -> C -> D with fee cuts in short time window.",
        "primary_signals": ["GRAPH_LAYERING_CHAIN", "HOP_VELOCITY"],
        "default_tx_count": 3,
    },
    ScenarioType.FAN_OUT.value: {
        "description": "One source account rapidly disperses money to many recipient accounts (smurfing).",
        "primary_signals": ["DISPERSION_FAN_OUT", "SMURFING_PATTERN"],
        "default_tx_count": 7,
    },
}


# -----------------------------------------------------------------------------
# Public Scenario Injection API
# -----------------------------------------------------------------------------

def list_scenarios() -> List[str]:
    """
    Return list of all available injectable fraud scenario identifiers.

    Returns:
        List of scenario name strings.
    """
    return list(SCENARIO_BUILDERS.keys())


def get_scenario_info(scenario_name: str) -> Dict[str, Any]:
    """
    Retrieve descriptive metadata for a specific scenario.

    Args:
        scenario_name: Name of the scenario.

    Returns:
        Dictionary containing description and expected detection signals.
    """
    name_upper = scenario_name.strip().upper()
    if name_upper not in SCENARIO_METADATA:
        raise ValueError(
            f"Unknown scenario '{scenario_name}'. Available scenarios: {', '.join(list_scenarios())}"
        )
    return {
        "scenario_name": name_upper,
        **SCENARIO_METADATA[name_upper]
    }


def inject_scenario(
    scenario_name: str,
    generator_state: TransactionGenerator,
    start_time: Optional[datetime] = None,
    seed: Optional[int] = None,
    **kwargs: Any
) -> List[Transaction]:
    """
    Inject a deterministic fraud attack scenario into the generator stream.

    Args:
        scenario_name: Identifier of the scenario (e.g. 'HIGH_VELOCITY', 'MULTI_ACCOUNT_CHAIN').
        generator_state: An active TransactionGenerator instance.
        start_time: Optional base timestamp for the scenario transactions.
                    If None, uses generator's current simulation time.
        seed: Optional explicit random seed for 100% deterministic scenario generation.
        **kwargs: Additional scenario-specific override parameters (e.g., burst_count, chain_length).

    Returns:
        List of generated Transaction objects marked with is_fraud_scenario=True and scenario_id.

    Raises:
        ValueError: If scenario_name is unrecognized or configuration requirements are unmet.
    """
    if not isinstance(scenario_name, str):
        raise ValueError("scenario_name must be a string.")

    name_upper = scenario_name.strip().upper()
    builder = SCENARIO_BUILDERS.get(name_upper)
    if not builder:
        raise ValueError(
            f"Unknown scenario '{scenario_name}'. Available scenarios: {', '.join(list_scenarios())}"
        )

    # Use explicit localized PRNG instance
    if seed is not None:
        rng = random.Random(seed)
    else:
        rng = random.Random(generator_state._rng.randint(0, 1_000_000))

    if start_time is None:
        base_time = generator_state._current_sim_time
    else:
        base_time = start_time
        if base_time.tzinfo is None:
            base_time = base_time.replace(tzinfo=timezone.utc)

    # Execute scenario builder
    scenario_txs = builder(
        generator=generator_state,
        rng=rng,
        start_time=base_time,
        **kwargs
    )

    return scenario_txs
