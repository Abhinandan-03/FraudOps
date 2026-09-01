"""
Synthetic Transaction Generator Module for FraudOps.

Generates continuous streams and discrete batches of realistic normal financial transactions
grounded in distinct account behavioral profiles (low-value frequent, retail, high-value, business).
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Iterator, List, Optional
import math
import random
import uuid

from detection.generator.config import (
    DEFAULT_LOCATIONS,
    DEFAULT_MERCHANT_CATEGORIES,
    GeneratorConfig,
)
from detection.generator.models import (
    AccountProfile,
    AccountProfileType,
    DeviceProfile,
    MerchantProfile,
    Transaction,
    TransactionType,
)


class TransactionGenerator:
    """
    Stateful generator for synthetic transaction streams.

    Features:
    - Dedicated local pseudo-random number generator (PRNG) for full determinism and reproducibility.
    - Grounded behavioral profiles for accounts, devices, and merchants.
    - Monotonically advancing simulation clock with realistic transaction interval jitter.
    - Support for both batch generation and stoppable streaming iterators.
    """

    def __init__(self, config: Optional[GeneratorConfig] = None, seed: Optional[int] = None):
        """
        Initialize the Transaction Generator.

        Args:
            config: Optional GeneratorConfig. If omitted, default configuration is used.
            seed: Optional random seed. If provided, overrides config.seed.
        """
        self.config = config or GeneratorConfig()
        if seed is not None:
            self.config.seed = seed

        # Explicit local PRNG instance - never mutates global random state
        self._rng = random.Random(self.config.seed)

        # Simulation clock
        base_time = self.config.default_start_time or datetime.now(timezone.utc)
        if base_time.tzinfo is None:
            base_time = base_time.replace(tzinfo=timezone.utc)
        self._current_sim_time: datetime = base_time

        # Streaming control flag
        self._is_streaming: bool = False
        self._tx_counter: int = 0

        # State storage
        self._accounts: Dict[str, AccountProfile] = {}
        self._merchants: Dict[str, MerchantProfile] = {}
        self._devices: Dict[str, DeviceProfile] = {}

        # Initialize entity ecosystems
        self._initialize_devices()
        self._initialize_merchants()
        self._initialize_accounts()

    # -------------------------------------------------------------------------
    # Entity Initialization
    # -------------------------------------------------------------------------

    def _initialize_devices(self) -> None:
        """Populate the global pool of realistic user devices and fingerprints."""
        device_types = [
            ("mobile", "iOS / Mobile Safari", "iOS 17.4"),
            ("mobile", "Android / Chrome Mobile", "Android 14"),
            ("desktop", "macOS / Chrome 122", "macOS Sonoma"),
            ("desktop", "Windows 11 / Edge 122", "Windows 11"),
            ("desktop", "Linux / Firefox 123", "Ubuntu 22.04"),
            ("tablet", "iPadOS / Mobile Safari", "iPadOS 17.4"),
        ]

        for i in range(1, self.config.num_devices + 1):
            dev_id = f"dev-{i:04d}"
            dtype, uagent, os_ver = self._rng.choice(device_types)
            self._devices[dev_id] = DeviceProfile(
                device_id=dev_id,
                device_type=dtype,
                user_agent=f"{uagent} ({os_ver})",
                operating_system=os_ver,
            )

    def _initialize_merchants(self) -> None:
        """Create merchant profiles spanning standard commercial categories."""
        merchant_names = [
            ("MegaMart Superstore", "RETAIL"),
            ("FreshFarm Grocers", "GROCERY"),
            ("Urban Bean Roasters", "DINING"),
            ("Apex Electronics", "ELECTRONICS"),
            ("Global Airways", "TRAVEL"),
            ("Metro Cineplex", "ENTERTAINMENT"),
            ("City Power & Grid", "UTILITIES"),
            ("Aura Luxe Jewels", "LUXURY"),
            ("Starlight Bistro", "DINING"),
            ("OmniBooks & Media", "RETAIL"),
            ("Skyline Hotel & Resort", "TRAVEL"),
            ("ByteCore Hardware", "ELECTRONICS"),
            ("QuickStop Express", "GROCERY"),
            ("Vanguard Fashion House", "LUXURY"),
            ("CloudStream Services", "ENTERTAINMENT"),
        ]

        category_ranges = {cat: (mn, mx) for cat, mn, mx in DEFAULT_MERCHANT_CATEGORIES}

        for i in range(1, self.config.num_merchants + 1):
            merch_id = f"merch-{i:04d}"
            name, cat = merchant_names[(i - 1) % len(merchant_names)]
            loc = self._rng.choice(self.config.locations)
            min_a, max_a = category_ranges.get(cat, (10.0, 500.0))

            self._merchants[merch_id] = MerchantProfile(
                merchant_id=merch_id,
                name=f"{name} #{i}",
                category=cat,
                location=loc,
                min_amount=min_a,
                max_amount=max_a,
            )

    def _initialize_accounts(self) -> None:
        """Create distinct account profiles with differentiated spending behaviors."""
        device_ids = list(self._devices.keys())
        merchant_ids = list(self._merchants.keys())

        # Distribution weights: 35% low-value, 45% normal retail, 15% high-value, 5% business
        profile_archetypes = [
            (AccountProfileType.LOW_VALUE_FREQUENT, 0.35, 2.0, 45.0, 14.0, 6.0, 2.5),
            (AccountProfileType.NORMAL_RETAIL, 0.45, 15.0, 350.0, 65.0, 30.0, 1.0),
            (AccountProfileType.HIGH_VALUE_OCCASIONAL, 0.15, 150.0, 3500.0, 650.0, 250.0, 0.4),
            (AccountProfileType.BUSINESS, 0.05, 300.0, 5000.0, 1800.0, 600.0, 1.8),
        ]

        for i in range(1, self.config.num_accounts + 1):
            acc_id = f"acc-{i:04d}"
            
            # Select archetype based on distribution
            roll = self._rng.random()
            cumulative = 0.0
            chosen_archetype = profile_archetypes[0]
            for arch in profile_archetypes:
                cumulative += arch[1]
                if roll <= cumulative:
                    chosen_archetype = arch
                    break

            ptype, _, min_a, max_a, mean_a, std_a, vel_w = chosen_archetype

            # Assign persistent primary and optional secondary device
            primary_dev = self._rng.choice(device_ids)
            secondary_devs = []
            if self._rng.random() < 0.4:
                sec_dev = self._rng.choice(device_ids)
                if sec_dev != primary_dev:
                    secondary_devs.append(sec_dev)

            # Assign location and network IP prefix
            base_loc = self._rng.choice(self.config.locations)
            ip_prefix = f"192.168.{self._rng.randint(10, 240)}."

            # Assign 2-5 preferred merchants
            num_preferred = self._rng.randint(2, min(5, len(merchant_ids)))
            preferred_m = self._rng.sample(merchant_ids, num_preferred)

            self._accounts[acc_id] = AccountProfile(
                account_id=acc_id,
                profile_type=ptype,
                base_location=base_loc,
                primary_device_id=primary_dev,
                secondary_devices=secondary_devs,
                primary_ip_prefix=ip_prefix,
                min_amount=min_a,
                max_amount=max_a,
                mean_amount=mean_a,
                std_amount=std_a,
                velocity_weight=vel_w,
                preferred_merchants=preferred_m,
                allowed_types=[TransactionType.PURCHASE.value, TransactionType.TRANSFER.value],
            )

    # -------------------------------------------------------------------------
    # Accessors & State Management
    # -------------------------------------------------------------------------

    def get_account(self, account_id: str) -> Optional[AccountProfile]:
        """Retrieve an account profile by account ID."""
        return self._accounts.get(account_id)

    def get_all_accounts(self) -> List[AccountProfile]:
        """Get all generated account profiles."""
        return list(self._accounts.values())

    def get_merchant(self, merchant_id: str) -> Optional[MerchantProfile]:
        """Retrieve a merchant profile by merchant ID."""
        return self._merchants.get(merchant_id)

    def get_all_merchants(self) -> List[MerchantProfile]:
        """Get all registered merchant profiles."""
        return list(self._merchants.values())

    def reset(self, seed: Optional[int] = None) -> None:
        """
        Reset generator state and PRNG.

        Args:
            seed: Optional new seed. If None, resets to original config seed.
        """
        if seed is not None:
            self.config.seed = seed
        self._rng = random.Random(self.config.seed)
        base_time = self.config.default_start_time or datetime.now(timezone.utc)
        if base_time.tzinfo is None:
            base_time = base_time.replace(tzinfo=timezone.utc)
        self._current_sim_time = base_time
        self._is_streaming = False
        self._tx_counter = 0

        self._accounts.clear()
        self._merchants.clear()
        self._devices.clear()
        self._initialize_devices()
        self._initialize_merchants()
        self._initialize_accounts()

    # -------------------------------------------------------------------------
    # Core Transaction Generation
    # -------------------------------------------------------------------------

    def _select_sender_account(self) -> AccountProfile:
        """Select a sender account weighted by their behavioral velocity profile."""
        accounts = list(self._accounts.values())
        weights = [acc.velocity_weight for acc in accounts]
        return self._rng.choices(accounts, weights=weights, k=1)[0]

    def _sample_amount_for_account(self, account: AccountProfile, merchant: Optional[MerchantProfile] = None) -> float:
        """
        Generate a realistic transaction amount respecting account & merchant boundaries.
        Uses a truncated log-normal distribution to reflect real-world spending curves.
        """
        # Calculate log-normal mu and sigma from mean and standard deviation
        mean = account.mean_amount
        variance = account.std_amount ** 2
        sigma = math.sqrt(math.log(1 + variance / (mean ** 2)))
        mu = math.log(mean) - 0.5 * (sigma ** 2)

        raw_amount = self._rng.lognormvariate(mu, sigma)

        # Bound to account profile limits
        bounded = max(account.min_amount, min(account.max_amount, raw_amount))

        # Further constrain by merchant bounds if applicable
        if merchant:
            bounded = max(merchant.min_amount, min(merchant.max_amount, bounded))

        # Enforce global constraints
        bounded = max(self.config.min_amount, min(self.config.max_amount, bounded))
        return round(bounded, 2)

    def _advance_clock(self, seconds_delta: Optional[float] = None) -> datetime:
        """Advance the internal simulation clock by rate interval + realistic jitter."""
        if seconds_delta is not None:
            delta = seconds_delta
        else:
            base_interval = 1.0 / self.config.transaction_rate_per_second
            # Poisson-like exponential inter-arrival time
            delta = self._rng.expovariate(1.0 / base_interval)

        self._current_sim_time += timedelta(seconds=delta)
        return self._current_sim_time

    def generate_transaction(self, timestamp: Optional[datetime] = None) -> Transaction:
        """
        Generate a single realistic normal transaction.

        Args:
            timestamp: Optional explicit timestamp. If None, advances simulation clock.

        Returns:
            A typed Transaction instance.
        """
        self._tx_counter += 1
        sender = self._select_sender_account()

        # Decide whether this is a purchase or P2P transfer
        is_purchase = self._rng.random() < self.config.account_to_merchant_ratio
        
        if is_purchase:
            tx_type = TransactionType.PURCHASE.value
            # 80% preference for favored merchants, 20% random discovery
            if sender.preferred_merchants and self._rng.random() < 0.8:
                merchant_id = self._rng.choice(sender.preferred_merchants)
            else:
                merchant_id = self._rng.choice(list(self._merchants.keys()))
            
            merchant = self._merchants[merchant_id]
            receiver_id = merchant_id
            amount = self._sample_amount_for_account(sender, merchant)
        else:
            tx_type = TransactionType.TRANSFER.value
            merchant_id = None
            merchant = None
            # Select different receiver account
            other_accounts = [acc_id for acc_id in self._accounts if acc_id != sender.account_id]
            receiver_id = self._rng.choice(other_accounts) if other_accounts else "acc-0001"
            amount = self._sample_amount_for_account(sender, None)

        # Select device (90% primary, 10% secondary if available)
        if sender.secondary_devices and self._rng.random() < 0.1:
            device_id = self._rng.choice(sender.secondary_devices)
        else:
            device_id = sender.primary_device_id

        # Location (98% home base, 2% travel)
        if self._rng.random() < 0.02:
            location = self._rng.choice(self.config.locations)
        else:
            location = sender.base_location

        # IP address within sender's subnet
        ip_host = self._rng.randint(2, 254)
        ip_address = f"{sender.primary_ip_prefix}{ip_host}"

        # Determine timestamp
        if timestamp is not None:
            tx_time = timestamp
        else:
            tx_time = self._advance_clock()

        iso_timestamp = tx_time.isoformat()
        tx_id = f"tx-{self._tx_counter:08d}-{self._rng.randint(1000, 9999)}"

        return Transaction(
            transaction_id=tx_id,
            timestamp=iso_timestamp,
            sender_account_id=sender.account_id,
            receiver_account_id=receiver_id,
            amount=amount,
            currency=self.config.currency,
            merchant_id=merchant_id,
            device_id=device_id,
            ip_address=ip_address,
            location=location,
            transaction_type=tx_type,
            is_fraud_scenario=False,
            scenario_id=None,
            metadata={
                "sender_profile": sender.profile_type.value,
                "simulated_channel": "WEB" if "desktop" in self._devices.get(device_id, DeviceProfile("", "mobile", "", "")).device_type else "MOBILE_APP"
            }
        )

    # -------------------------------------------------------------------------
    # Batch Generation APIs
    # -------------------------------------------------------------------------

    def generate_normal_transactions(
        self,
        count: int,
        start_time: Optional[datetime] = None
    ) -> List[Transaction]:
        """
        Generate a batch of realistic normal transactions.

        Args:
            count: Number of transactions to generate.
            start_time: Optional starting timestamp for the batch sequence.

        Returns:
            List of generated Transaction objects.
        """
        if count < 0:
            raise ValueError(f"count cannot be negative, got {count}")
        if start_time is not None:
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            self._current_sim_time = start_time

        return [self.generate_transaction() for _ in range(count)]

    def generate_transactions(
        self,
        count: int,
        start_time: Optional[datetime] = None
    ) -> List[Transaction]:
        """
        Alias for batch transaction generation.

        Args:
            count: Number of transactions to generate.
            start_time: Optional starting timestamp.

        Returns:
            List of generated Transaction objects.
        """
        return self.generate_normal_transactions(count=count, start_time=start_time)

    # -------------------------------------------------------------------------
    # Streaming Generation API
    # -------------------------------------------------------------------------

    def stream_transactions(
        self,
        max_count: Optional[int] = None,
        interval_seconds: float = 0.0,
        start_time: Optional[datetime] = None
    ) -> Iterator[Transaction]:
        """
        Yield transactions one at a time via a generator iterator.

        Supports clean cancellation via stop_stream() or setting max_count.

        Args:
            max_count: Optional maximum number of transactions to yield before ending.
                       If None, streams indefinitely until stop_stream() is called.
            interval_seconds: Simulated seconds advanced per yielded transaction.
                              If 0.0, calculates inter-arrival dynamically from transaction_rate.
            start_time: Optional starting simulation timestamp.

        Yields:
            Transaction instances sequentially.
        """
        if start_time is not None:
            if start_time.tzinfo is None:
                start_time = start_time.replace(tzinfo=timezone.utc)
            self._current_sim_time = start_time

        self._is_streaming = True
        yielded_count = 0

        while self._is_streaming:
            if max_count is not None and yielded_count >= max_count:
                break

            step = interval_seconds if interval_seconds > 0.0 else None
            tx_time = self._advance_clock(seconds_delta=step)
            tx = self.generate_transaction(timestamp=tx_time)
            yielded_count += 1
            yield tx

        self._is_streaming = False

    def stop_stream(self) -> None:
        """Signal the active streaming generator to halt after current item."""
        self._is_streaming = False
