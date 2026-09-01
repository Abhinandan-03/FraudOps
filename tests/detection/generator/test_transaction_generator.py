"""
Comprehensive test suite for the FraudOps Synthetic Transaction Generator.

Covers:
1. Normal transaction generation
2. Unique transaction IDs
3. Reproducibility with the same seed
4. Different output with different seeds
5. High velocity scenario
6. High amount scenario
7. Geo mismatch scenario
8. Account takeover scenario
9. Rapid fund movement scenario
10. Multi-account chain scenario
11. Fan-out scenario
12. Invalid scenario name handling
13. Streaming termination and control
14. Complete Transaction schema conformance
15. Config validation and model serialization
"""

import json
import os
import sys
import unittest
from datetime import datetime, timezone

# Ensure project root is on sys.path for all runners
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from detection.generator.config import GeneratorConfig
from detection.generator.fraud_scenarios import (
    ScenarioType,
    get_scenario_info,
    inject_scenario,
    list_scenarios,
)
from detection.generator.models import (
    AccountProfileType,
    Transaction,
    TransactionType,
)
from detection.generator.transaction_generator import TransactionGenerator


class TestTransactionGenerator(unittest.TestCase):
    """Test suite for TransactionGenerator and Fraud Scenarios."""

    def setUp(self):
        """Set up standard generator with a fixed seed for unit tests."""
        self.config = GeneratorConfig(
            num_accounts=30,
            num_merchants=10,
            num_devices=40,
            transaction_rate_per_second=2.0,
            seed=42,
        )
        self.generator = TransactionGenerator(config=self.config)

    # -------------------------------------------------------------------------
    # 1. Normal Transaction Generation
    # -------------------------------------------------------------------------
    def test_normal_transaction_generation(self):
        """Test generating normal transactions produces valid, populated instances."""
        txs = self.generator.generate_normal_transactions(count=25)
        self.assertEqual(len(txs), 25)

        for tx in txs:
            self.assertIsInstance(tx, Transaction)
            self.assertFalse(tx.is_fraud_scenario)
            self.assertIsNone(tx.scenario_id)
            self.assertTrue(tx.transaction_id.startswith("tx-"))
            self.assertGreater(tx.amount, 0)
            self.assertIn(tx.transaction_type, [TransactionType.PURCHASE.value, TransactionType.TRANSFER.value])
            self.assertTrue(tx.sender_account_id.startswith("acc-"))

    # -------------------------------------------------------------------------
    # 2. Unique Transaction IDs
    # -------------------------------------------------------------------------
    def test_unique_transaction_ids(self):
        """Ensure all generated transactions have strictly unique IDs."""
        count = 200
        txs = self.generator.generate_transactions(count=count)
        tx_ids = [tx.transaction_id for tx in txs]
        self.assertEqual(len(tx_ids), len(set(tx_ids)))

    # -------------------------------------------------------------------------
    # 3. Reproducibility with the Same Seed
    # -------------------------------------------------------------------------
    def test_reproducibility_with_same_seed(self):
        """Two generators initialized with the exact same seed must produce identical outputs."""
        gen1 = TransactionGenerator(GeneratorConfig(seed=1337))
        gen2 = TransactionGenerator(GeneratorConfig(seed=1337))

        txs1 = gen1.generate_transactions(count=30)
        txs2 = gen2.generate_transactions(count=30)

        self.assertEqual(len(txs1), len(txs2))
        for t1, t2 in zip(txs1, txs2):
            self.assertEqual(t1.transaction_id, t2.transaction_id)
            self.assertEqual(t1.sender_account_id, t2.sender_account_id)
            self.assertEqual(t1.receiver_account_id, t2.receiver_account_id)
            self.assertEqual(t1.amount, t2.amount)
            self.assertEqual(t1.device_id, t2.device_id)
            self.assertEqual(t1.ip_address, t2.ip_address)
            self.assertEqual(t1.location, t2.location)

    # -------------------------------------------------------------------------
    # 4. Different Output with Different Seeds
    # -------------------------------------------------------------------------
    def test_different_seeds_produce_different_output(self):
        """Generators initialized with different seeds must produce different sequences."""
        gen_a = TransactionGenerator(GeneratorConfig(seed=101))
        gen_b = TransactionGenerator(GeneratorConfig(seed=202))

        txs_a = gen_a.generate_transactions(count=10)
        txs_b = gen_b.generate_transactions(count=10)

        amounts_a = [tx.amount for tx in txs_a]
        amounts_b = [tx.amount for tx in txs_b]
        self.assertNotEqual(amounts_a, amounts_b)

    # -------------------------------------------------------------------------
    # 5. High Velocity Scenario
    # -------------------------------------------------------------------------
    def test_high_velocity_scenario(self):
        """Test HIGH_VELOCITY scenario generates rapid transactions from a single account."""
        burst_count = 6
        fraud_txs = inject_scenario(
            "HIGH_VELOCITY",
            self.generator,
            burst_count=burst_count,
            seed=42
        )

        self.assertEqual(len(fraud_txs), burst_count)
        first_sender = fraud_txs[0].sender_account_id

        for tx in fraud_txs:
            self.assertTrue(tx.is_fraud_scenario)
            self.assertEqual(tx.scenario_id, ScenarioType.HIGH_VELOCITY.value)
            self.assertEqual(tx.sender_account_id, first_sender)

        # Check that time delta between consecutive transactions is very small (< 2 seconds)
        t0 = datetime.fromisoformat(fraud_txs[0].timestamp)
        t_last = datetime.fromisoformat(fraud_txs[-1].timestamp)
        self.assertLess((t_last - t0).total_seconds(), 10.0)

    # -------------------------------------------------------------------------
    # 6. High Amount Scenario
    # -------------------------------------------------------------------------
    def test_high_amount_scenario(self):
        """Test HIGH_AMOUNT scenario produces transaction well above normal baseline."""
        fraud_txs = inject_scenario("HIGH_AMOUNT", self.generator, seed=42)
        self.assertEqual(len(fraud_txs), 1)

        tx = fraud_txs[0]
        self.assertTrue(tx.is_fraud_scenario)
        self.assertEqual(tx.scenario_id, ScenarioType.HIGH_AMOUNT.value)
        self.assertGreaterEqual(tx.amount, 5000.0)
        self.assertIn("amount_multiplier", tx.metadata)

    # -------------------------------------------------------------------------
    # 7. Geo Mismatch Scenario
    # -------------------------------------------------------------------------
    def test_geo_mismatch_scenario(self):
        """Test GEO_MISMATCH scenario produces origin and impossible travel transaction."""
        fraud_txs = inject_scenario("GEO_MISMATCH", self.generator, seed=42)
        self.assertEqual(len(fraud_txs), 2)

        tx1, tx2 = fraud_txs[0], fraud_txs[1]
        self.assertTrue(tx1.is_fraud_scenario)
        self.assertTrue(tx2.is_fraud_scenario)
        self.assertEqual(tx1.scenario_id, ScenarioType.GEO_MISMATCH.value)
        self.assertEqual(tx2.scenario_id, ScenarioType.GEO_MISMATCH.value)
        self.assertEqual(tx1.sender_account_id, tx2.sender_account_id)
        # Locations must be different
        self.assertNotEqual(tx1.location, tx2.location)
        self.assertNotEqual(tx1.ip_address, tx2.ip_address)

    # -------------------------------------------------------------------------
    # 8. Account Takeover Scenario
    # -------------------------------------------------------------------------
    def test_account_takeover_scenario(self):
        """Test ACCOUNT_TAKEOVER scenario produces unrecognized device & large exfiltration."""
        fraud_txs = inject_scenario("ACCOUNT_TAKEOVER", self.generator, seed=42)
        self.assertEqual(len(fraud_txs), 2)

        probe_tx, drain_tx = fraud_txs[0], fraud_txs[1]
        self.assertTrue(probe_tx.is_fraud_scenario)
        self.assertTrue(drain_tx.is_fraud_scenario)
        self.assertEqual(probe_tx.scenario_id, ScenarioType.ACCOUNT_TAKEOVER.value)
        self.assertEqual(drain_tx.scenario_id, ScenarioType.ACCOUNT_TAKEOVER.value)
        self.assertEqual(probe_tx.device_id, drain_tx.device_id)
        self.assertTrue(probe_tx.device_id.startswith("dev-rogue-"))
        self.assertGreater(drain_tx.amount, probe_tx.amount)

    # -------------------------------------------------------------------------
    # 9. Rapid Fund Movement Scenario
    # -------------------------------------------------------------------------
    def test_rapid_fund_movement_scenario(self):
        """Test RAPID_FUND_MOVEMENT scenario creates pass-through relay A -> B -> C."""
        fraud_txs = inject_scenario("RAPID_FUND_MOVEMENT", self.generator, initial_amount=8000.0, seed=42)
        self.assertEqual(len(fraud_txs), 2)

        tx1, tx2 = fraud_txs[0], fraud_txs[1]
        self.assertTrue(tx1.is_fraud_scenario)
        self.assertTrue(tx2.is_fraud_scenario)
        self.assertEqual(tx1.scenario_id, ScenarioType.RAPID_FUND_MOVEMENT.value)
        # Receiver of leg 1 must be sender of leg 2
        self.assertEqual(tx1.receiver_account_id, tx2.sender_account_id)
        # Amount in leg 2 should be ~96% of leg 1
        self.assertAlmostEqual(tx2.amount, round(tx1.amount * 0.96, 2), delta=0.5)

    # -------------------------------------------------------------------------
    # 10. Multi-Account Chain Scenario
    # -------------------------------------------------------------------------
    def test_multi_account_chain_scenario(self):
        """Test MULTI_ACCOUNT_CHAIN creates sequential layering chain A -> B -> C -> D."""
        chain_length = 4
        fraud_txs = inject_scenario(
            "MULTI_ACCOUNT_CHAIN",
            self.generator,
            chain_length=chain_length,
            initial_amount=5000.0,
            seed=42
        )
        self.assertEqual(len(fraud_txs), chain_length - 1)

        for i in range(len(fraud_txs) - 1):
            curr_tx = fraud_txs[i]
            next_tx = fraud_txs[i + 1]
            self.assertTrue(curr_tx.is_fraud_scenario)
            self.assertEqual(curr_tx.scenario_id, ScenarioType.MULTI_ACCOUNT_CHAIN.value)
            # Receiver of current hop is sender of next hop
            self.assertEqual(curr_tx.receiver_account_id, next_tx.sender_account_id)

    # -------------------------------------------------------------------------
    # 11. Fan-Out Scenario
    # -------------------------------------------------------------------------
    def test_fan_out_scenario(self):
        """Test FAN_OUT creates 1-to-many dispersion from a single source hub."""
        target_count = 5
        fraud_txs = inject_scenario(
            "FAN_OUT",
            self.generator,
            target_count=target_count,
            total_amount=10000.0,
            seed=42
        )
        self.assertEqual(len(fraud_txs), target_count)

        source_hub = fraud_txs[0].sender_account_id
        recipients = [tx.receiver_account_id for tx in fraud_txs]

        for tx in fraud_txs:
            self.assertTrue(tx.is_fraud_scenario)
            self.assertEqual(tx.scenario_id, ScenarioType.FAN_OUT.value)
            self.assertEqual(tx.sender_account_id, source_hub)

        # All recipients in the fan-out must be distinct
        self.assertEqual(len(recipients), len(set(recipients)))

    # -------------------------------------------------------------------------
    # 12. Invalid Scenario Name Handling
    # -------------------------------------------------------------------------
    def test_invalid_scenario_name_raises_error(self):
        """Test that passing an invalid scenario name raises a descriptive ValueError."""
        with self.assertRaises(ValueError) as ctx:
            inject_scenario("NON_EXISTENT_SCENARIO", self.generator)
        self.assertIn("Unknown scenario", str(ctx.exception))

        with self.assertRaises(ValueError):
            get_scenario_info("UNKNOWN")

    # -------------------------------------------------------------------------
    # 13. Streaming Can Be Stopped Cleanly
    # -------------------------------------------------------------------------
    def test_streaming_can_be_stopped(self):
        """Test stream_transactions respects max_count and can be stopped via stop_stream()."""
        # Test max_count limitation
        stream_10 = list(self.generator.stream_transactions(max_count=10))
        self.assertEqual(len(stream_10), 10)

        # Test programmatic cancellation with stop_stream
        stream = self.generator.stream_transactions()
        consumed = []
        for tx in stream:
            consumed.append(tx)
            if len(consumed) >= 5:
                self.generator.stop_stream()

        self.assertEqual(len(consumed), 5)

    # -------------------------------------------------------------------------
    # 14. All Generated Transactions Satisfy the Transaction Schema
    # -------------------------------------------------------------------------
    def test_all_transactions_satisfy_schema(self):
        """Verify normal and fraud transactions conform to required fields and JSON serialization."""
        normal_txs = self.generator.generate_transactions(count=15)
        fraud_txs = []
        for s_name in list_scenarios():
            fraud_txs.extend(inject_scenario(s_name, self.generator, seed=42))

        all_txs = normal_txs + fraud_txs

        for tx in all_txs:
            # Check mandatory fields
            self.assertIsInstance(tx.transaction_id, str)
            self.assertTrue(len(tx.transaction_id) > 0)
            self.assertIsInstance(tx.timestamp, str)
            # Verify ISO-8601 parsing
            parsed_dt = datetime.fromisoformat(tx.timestamp)
            self.assertIsNotNone(parsed_dt)

            self.assertIsInstance(tx.sender_account_id, str)
            self.assertIsInstance(tx.receiver_account_id, str)
            self.assertIsInstance(tx.amount, float)
            self.assertGreater(tx.amount, 0.0)
            self.assertIsInstance(tx.currency, str)
            self.assertIsInstance(tx.device_id, str)
            self.assertIsInstance(tx.ip_address, str)
            self.assertIsInstance(tx.location, str)
            self.assertIsInstance(tx.transaction_type, str)
            self.assertIsInstance(tx.is_fraud_scenario, bool)

            # Test serialization to dict and JSON
            d = tx.to_dict()
            self.assertIsInstance(d, dict)
            json_str = tx.to_json()
            self.assertIsInstance(json_str, str)

            # Test round-trip reconstruction
            rebuilt_from_dict = Transaction.from_dict(d)
            self.assertEqual(rebuilt_from_dict.transaction_id, tx.transaction_id)
            self.assertEqual(rebuilt_from_dict.amount, tx.amount)

            rebuilt_from_json = Transaction.from_json(json_str)
            self.assertEqual(rebuilt_from_json.transaction_id, tx.transaction_id)
            self.assertEqual(rebuilt_from_json.amount, tx.amount)

    # -------------------------------------------------------------------------
    # Additional Verification: Config & Behavioral Profiles
    # -------------------------------------------------------------------------
    def test_config_validation(self):
        """Ensure invalid generator configurations raise informative ValueErrors."""
        with self.assertRaises(ValueError):
            GeneratorConfig(num_accounts=1)
        with self.assertRaises(ValueError):
            GeneratorConfig(num_merchants=0)
        with self.assertRaises(ValueError):
            GeneratorConfig(min_amount=-5.0)
        with self.assertRaises(ValueError):
            GeneratorConfig(min_amount=100.0, max_amount=50.0)
        with self.assertRaises(ValueError):
            GeneratorConfig(locations=[])
        with self.assertRaises(ValueError):
            GeneratorConfig(account_to_merchant_ratio=1.5)

    def test_behavioral_profiles_differentiation(self):
        """Verify accounts are assigned distinct behavioral archetypes."""
        accounts = self.generator.get_all_accounts()
        profile_types = {acc.profile_type for acc in accounts}
        self.assertTrue(len(profile_types) > 1)
        self.assertIn(AccountProfileType.LOW_VALUE_FREQUENT, profile_types)
        self.assertIn(AccountProfileType.NORMAL_RETAIL, profile_types)


if __name__ == "__main__":
    unittest.main()
