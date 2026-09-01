"""
Data models for the FraudOps Synthetic Transaction Generator.

Provides typed models for Transactions, Account Profiles, Merchant Profiles,
and Device Profiles.
"""

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, Dict, Any, List
import json
import uuid


class TransactionType(str, Enum):
    """Standard transaction types supported across the FraudOps pipeline."""
    PURCHASE = "PURCHASE"
    TRANSFER = "TRANSFER"
    WITHDRAWAL = "WITHDRAWAL"
    PAYMENT = "PAYMENT"
    REFUND = "REFUND"


class AccountProfileType(str, Enum):
    """Behavioral profile categories used to establish anomaly detection baselines."""
    LOW_VALUE_FREQUENT = "LOW_VALUE_FREQUENT"
    NORMAL_RETAIL = "NORMAL_RETAIL"
    HIGH_VALUE_OCCASIONAL = "HIGH_VALUE_OCCASIONAL"
    BUSINESS = "BUSINESS"


@dataclass
class Transaction:
    """
    Core Transaction model for the FraudOps detection engine and graph analyzer.

    Attributes:
        transaction_id: Unique identifier for the transaction.
        timestamp: ISO-8601 formatted UTC timestamp string.
        sender_account_id: Account ID initiating the transaction.
        receiver_account_id: Account ID or merchant receiving funds.
        amount: Transaction monetary amount (rounded to 2 decimal places).
        currency: ISO-4217 currency code (e.g. 'USD', 'EUR').
        device_id: Identifier of the originating device.
        ip_address: IPv4 / IPv6 address of the transaction origin.
        location: ISO-3166 / regional location code (e.g. 'US-NYC', 'GB-LON').
        transaction_type: Transaction type category (PURCHASE, TRANSFER, etc.).
        is_fraud_scenario: Flag indicating if transaction was part of a synthetic fraud scenario.
        merchant_id: Optional identifier if the transaction is a merchant purchase.
        scenario_id: Optional identifier of the specific injected fraud scenario.
        metadata: Extensible dictionary for downstream detection signals & graph attributes.
    """
    transaction_id: str
    timestamp: str
    sender_account_id: str
    receiver_account_id: str
    amount: float
    currency: str = "USD"
    merchant_id: Optional[str] = None
    device_id: str = "dev-unknown"
    ip_address: str = "127.0.0.1"
    location: str = "US-NYC"
    transaction_type: str = TransactionType.PURCHASE.value
    is_fraud_scenario: bool = False
    scenario_id: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        # Enforce float conversion & 2 decimal places
        self.amount = round(float(self.amount), 2)
        if not self.transaction_id:
            self.transaction_id = f"tx-{uuid.uuid4().hex[:12]}"
        if not self.timestamp:
            self.timestamp = datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        """Convert transaction model instance to a standard Python dictionary."""
        return asdict(self)

    def to_json(self, indent: Optional[int] = None) -> str:
        """Serialize transaction to JSON string."""
        return json.dumps(self.to_dict(), indent=indent)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Transaction":
        """
        Reconstruct a Transaction instance from a dictionary.
        Safely casts fields and populates optional defaults.
        """
        clean_data = dict(data)
        return cls(
            transaction_id=str(clean_data["transaction_id"]),
            timestamp=str(clean_data["timestamp"]),
            sender_account_id=str(clean_data["sender_account_id"]),
            receiver_account_id=str(clean_data["receiver_account_id"]),
            amount=float(clean_data["amount"]),
            currency=str(clean_data.get("currency", "USD")),
            merchant_id=clean_data.get("merchant_id"),
            device_id=str(clean_data.get("device_id", "dev-unknown")),
            ip_address=str(clean_data.get("ip_address", "127.0.0.1")),
            location=str(clean_data.get("location", "US-NYC")),
            transaction_type=str(clean_data.get("transaction_type", TransactionType.PURCHASE.value)),
            is_fraud_scenario=bool(clean_data.get("is_fraud_scenario", False)),
            scenario_id=clean_data.get("scenario_id"),
            metadata=dict(clean_data.get("metadata", {}))
        )

    @classmethod
    def from_json(cls, json_str: str) -> "Transaction":
        """Deserialize a Transaction instance from a JSON string."""
        data = json.loads(json_str)
        return cls.from_dict(data)


@dataclass
class AccountProfile:
    """
    Behavioral baseline profile for an individual account.
    Used by anomaly detectors to contrast observed spending against baseline patterns.
    """
    account_id: str
    profile_type: AccountProfileType
    base_location: str
    primary_device_id: str
    secondary_devices: List[str] = field(default_factory=list)
    primary_ip_prefix: str = "192.168.1."
    min_amount: float = 5.0
    max_amount: float = 200.0
    mean_amount: float = 50.0
    std_amount: float = 20.0
    velocity_weight: float = 1.0  # Relative frequency of making transactions
    preferred_merchants: List[str] = field(default_factory=list)
    allowed_types: List[str] = field(default_factory=lambda: [
        TransactionType.PURCHASE.value,
        TransactionType.TRANSFER.value
    ])


@dataclass
class MerchantProfile:
    """
    Commercial merchant entity receiving purchase transactions.
    """
    merchant_id: str
    name: str
    category: str
    location: str
    min_amount: float
    max_amount: float


@dataclass
class DeviceProfile:
    """
    Hardware and client fingerprint profile.
    """
    device_id: str
    device_type: str  # "mobile", "desktop", "tablet", "pos"
    user_agent: str
    operating_system: str
