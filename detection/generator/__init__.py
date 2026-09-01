"""
FraudOps Synthetic Transaction Generator Package.

Provides tools to generate realistic baseline transaction streams and inject
deterministic fraud scenarios for detection benchmarking.
"""

from detection.generator.config import (
    DEFAULT_LOCATIONS,
    DEFAULT_MERCHANT_CATEGORIES,
    GeneratorConfig,
)
from detection.generator.fraud_scenarios import (
    ScenarioType,
    get_scenario_info,
    inject_scenario,
    list_scenarios,
)
from detection.generator.models import (
    AccountProfile,
    AccountProfileType,
    DeviceProfile,
    MerchantProfile,
    Transaction,
    TransactionType,
)
from detection.generator.transaction_generator import TransactionGenerator

__all__ = [
    "Transaction",
    "TransactionType",
    "AccountProfile",
    "AccountProfileType",
    "MerchantProfile",
    "DeviceProfile",
    "GeneratorConfig",
    "TransactionGenerator",
    "inject_scenario",
    "list_scenarios",
    "get_scenario_info",
    "ScenarioType",
    "DEFAULT_LOCATIONS",
    "DEFAULT_MERCHANT_CATEGORIES",
]
