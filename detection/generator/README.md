# FraudOps Synthetic Transaction Generator

A robust, modular synthetic transaction generator designed for the **FraudOps** real-time fraud detection simulator.

This module generates realistic financial transaction streams grounded in distinct account behavioral baselines and supports deterministic fraud attack injection for testing rule engines, anomaly detectors, graph analyzers, and backend APIs.

---

## 📁 Folder Structure

```
detection/
└── generator/
    ├── __init__.py                # Package exports
    ├── transaction_generator.py   # Core stream & batch generator with PRNG
    ├── fraud_scenarios.py         # 7 Deterministic fraud attack scenario injectors
    ├── models.py                  # Typed data models (Transaction, AccountProfile, etc.)
    ├── config.py                  # Validated generator configuration
    └── README.md                  # Documentation and API reference
```

---

## ⚙️ Installation & Requirements

- **Python Version**: Python 3.11+
- **External Dependencies**: **Zero** (built exclusively with Python standard library `dataclasses`, `datetime`, `random`, `json`, `uuid`, `enum`, `math`, `typing`).
- Works seamlessly in standalone scripts, background workers, and FastAPI backends.

---

## 🚀 Quickstart & Example Usage

### 1. Basic Import & Batch Generation

```python
from detection.generator import TransactionGenerator, GeneratorConfig

# 1. Initialize generator with reproducible seed
config = GeneratorConfig(
    num_accounts=50,
    num_merchants=15,
    transaction_rate_per_second=2.0,
    seed=42
)
generator = TransactionGenerator(config=config)

# 2. Generate a batch of normal transactions
transactions = generator.generate_transactions(count=10)

for tx in transactions:
    print(f"[{tx.timestamp}] {tx.sender_account_id} -> {tx.receiver_account_id}: ${tx.amount} ({tx.transaction_type})")
```

---

### 2. Streaming Transactions

The streaming generator yields transactions sequentially. Callers can limit the count or stop the stream at any time:

```python
from detection.generator import TransactionGenerator

generator = TransactionGenerator(seed=42)

# Stream 100 transactions
for tx in generator.stream_transactions(max_count=100):
    # Process transaction through detection pipeline
    print(f"Streaming TX: {tx.transaction_id} | Amount: ${tx.amount}")

# Or stream continuously with manual stop
stream = generator.stream_transactions()
for tx in stream:
    # Example stopping condition
    if tx.amount > 4500.0:
        generator.stop_stream()
```

---

### 3. Injecting Fraud Scenarios

Fraud scenarios inject specific suspicious behaviors rather than generic labels. Each injected transaction contains `is_fraud_scenario = True` and the corresponding `scenario_id`.

```python
from detection.generator import TransactionGenerator, inject_scenario, list_scenarios

generator = TransactionGenerator(seed=42)

# Available scenarios
print("Available scenarios:", list_scenarios())
# Output: ['HIGH_VELOCITY', 'HIGH_AMOUNT', 'GEO_MISMATCH', 'ACCOUNT_TAKEOVER',
#          'RAPID_FUND_MOVEMENT', 'MULTI_ACCOUNT_CHAIN', 'FAN_OUT']

# Inject a High Velocity burst (rapid card testing)
fraud_txs = inject_scenario("HIGH_VELOCITY", generator, burst_count=8, seed=123)

for tx in fraud_txs:
    print(f"Fraud TX: {tx.transaction_id} | Scenario: {tx.scenario_id} | Time: {tx.timestamp}")
```

---

## 🎯 Supported Fraud Scenarios

| Scenario ID | Attack Description | Key Behavioral Indicators | Downstream Detector Targets |
| :--- | :--- | :--- | :--- |
| `HIGH_VELOCITY` | Rapid burst of 5-15 transactions from a single account within seconds. | Short time deltas (`<1.5s`), repeated merchant hits. | Velocity rule engines, rate limiters. |
| `HIGH_AMOUNT` | Extreme transaction spike far exceeding the account's historical spending profile. | Amount is 15x–30x baseline mean/max. | Statistical anomaly detection, z-score models. |
| `GEO_MISMATCH` | Legitimate local transaction followed quickly by a transaction in a foreign jurisdiction. | Impossible physical travel velocity, proxy IP subnet. | Geolocation rules, IP proxy checkers. |
| `ACCOUNT_TAKEOVER` | Unfamiliar rogue device ID & foreign IP conducts probe and exfiltrates large balance. | Unrecognized device fingerprint, immediate drain. | Device reputation, ATO behavioral models. |
| `RAPID_FUND_MOVEMENT` | High-value deposit immediately forwarded (pass-through) to a secondary mule account. | Inflow-to-outflow delay `<5s`, 95%+ amount retention. | Mule account detection, flow velocity. |
| `MULTI_ACCOUNT_CHAIN` | Layered chain of transfers across multiple hops (`A -> B -> C -> D`). | Sequential transfers with structuring fee cuts. | Graph / cycle analysis, AML layering detectors. |
| `FAN_OUT` | One central source account rapidly disperses money across many recipient accounts (smurfing). | High out-degree in short time window. | Graph fan-out algorithms, smurfing monitors. |

---

## 📦 Transaction Model & JSON Schema

Every transaction satisfies the following JSON schema:

```json
{
  "transaction_id": "tx-00000001-4921",
  "timestamp": "2026-09-02T00:50:00.123456+00:00",
  "sender_account_id": "acc-0012",
  "receiver_account_id": "merch-0004",
  "amount": 42.50,
  "currency": "USD",
  "merchant_id": "merch-0004",
  "device_id": "dev-0018",
  "ip_address": "192.168.42.105",
  "location": "US-NYC",
  "transaction_type": "PURCHASE",
  "is_fraud_scenario": false,
  "scenario_id": null,
  "metadata": {
    "sender_profile": "NORMAL_RETAIL",
    "simulated_channel": "MOBILE_APP"
  }
}
```

### Methods on `Transaction`:
- `tx.to_dict()`: Converts instance to Python dictionary.
- `tx.to_json(indent=2)`: Serializes transaction to JSON string.
- `Transaction.from_dict(d)`: Reconstructs a `Transaction` instance from dictionary.
- `Transaction.from_json(s)`: Deserializes `Transaction` from JSON string.

---

## 🔌 Integration Guide for Backend (FastAPI / Workers)

To integrate this module into a FastAPI backend or message queue worker:

```python
# In backend service (e.g. app/services/stream_service.py)
from detection.generator import TransactionGenerator, GeneratorConfig, inject_scenario

class TransactionStreamService:
    def __init__(self, seed: int = 42):
        self.config = GeneratorConfig(seed=seed)
        self.generator = TransactionGenerator(self.config)

    def get_next_transaction(self):
        """Fetch next simulated normal transaction."""
        return self.generator.generate_transaction()

    def trigger_attack_scenario(self, scenario_name: str):
        """Inject a specific fraud attack for testing/demo."""
        return inject_scenario(scenario_name, self.generator)
```

---

## 🧪 Running Tests

To run the automated test suite:

```bash
# Using standard Python unittest
python -m unittest discover -s tests -p "test_*.py" -v

# Or using pytest if installed
pytest tests/ -v
```
