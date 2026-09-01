"""
Configuration module for the Synthetic Transaction Generator.

Provides default generation parameters and a validated GeneratorConfig dataclass.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Tuple


DEFAULT_LOCATIONS: Tuple[str, ...] = (
    "US-NYC",
    "US-SFO",
    "US-CHI",
    "US-MIA",
    "US-SEA",
    "GB-LON",
    "DE-BER",
    "FR-PAR",
    "JP-TYO",
    "SG-SIN",
    "CA-TOR",
    "AU-SYD",
)

DEFAULT_MERCHANT_CATEGORIES: Tuple[Tuple[str, float, float], ...] = (
    ("RETAIL", 10.0, 350.0),
    ("GROCERY", 15.0, 200.0),
    ("DINING", 8.0, 120.0),
    ("ELECTRONICS", 50.0, 2500.0),
    ("TRAVEL", 100.0, 3500.0),
    ("ENTERTAINMENT", 5.0, 80.0),
    ("UTILITIES", 30.0, 400.0),
    ("LUXURY", 250.0, 5000.0),
)


@dataclass
class GeneratorConfig:
    """
    Configuration options for synthetic transaction generation.

    Attributes:
        num_accounts: Total number of persistent customer/user account profiles.
        num_merchants: Total number of commercial merchant profiles.
        num_devices: Total pool of unique device IDs.
        transaction_rate_per_second: Simulated throughput (transactions emitted per simulated second).
        min_amount: Global minimum transaction amount constraint.
        max_amount: Global maximum transaction amount constraint.
        locations: List of supported geographic locations.
        currency: Default currency code (e.g. 'USD').
        seed: Optional integer seed for reproducible generation.
        account_to_merchant_ratio: Fraction of transactions that are merchant purchases vs P2P transfers (0.0 to 1.0).
        default_start_time: Optional base timestamp for simulation clock.
    """
    num_accounts: int = 100
    num_merchants: int = 20
    num_devices: int = 150
    transaction_rate_per_second: float = 1.0
    min_amount: float = 1.00
    max_amount: float = 5000.00
    locations: List[str] = field(default_factory=lambda: list(DEFAULT_LOCATIONS))
    currency: str = "USD"
    seed: Optional[int] = None
    account_to_merchant_ratio: float = 0.75
    default_start_time: Optional[datetime] = None

    def __post_init__(self):
        self.validate()

    def validate(self) -> None:
        """
        Validate configuration parameters.
        Raises ValueError if any parameter is outside valid operational bounds.
        """
        if self.num_accounts < 2:
            raise ValueError(f"num_accounts must be at least 2, got {self.num_accounts}")
        if self.num_merchants < 1:
            raise ValueError(f"num_merchants must be at least 1, got {self.num_merchants}")
        if self.num_devices < 1:
            raise ValueError(f"num_devices must be at least 1, got {self.num_devices}")
        if self.min_amount <= 0:
            raise ValueError(f"min_amount must be greater than 0, got {self.min_amount}")
        if self.max_amount < self.min_amount:
            raise ValueError(
                f"max_amount ({self.max_amount}) cannot be less than min_amount ({self.min_amount})"
            )
        if self.transaction_rate_per_second <= 0:
            raise ValueError(
                f"transaction_rate_per_second must be greater than 0, got {self.transaction_rate_per_second}"
            )
        if not self.locations:
            raise ValueError("locations list cannot be empty")
        if not (0.0 <= self.account_to_merchant_ratio <= 1.0):
            raise ValueError(
                f"account_to_merchant_ratio must be between 0.0 and 1.0, got {self.account_to_merchant_ratio}"
            )
        if not self.currency or not isinstance(self.currency, str) or len(self.currency.strip()) == 0:
            raise ValueError("currency must be a non-empty string")
