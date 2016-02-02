"""
tests.Resolver.ComputationResolver
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Resolver.ComputationResolver import ComputationResolver


class ComputationResolverTests(unittest.TestCase):
    """
    Tests for ComputationResolver
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.log_manager = mock.Mock()

        self.computation_resolver = ComputationResolver(
            self.log_manager
        )

    def test_from_dict(self):
        """
        ComputationResolver.from_dict - it should resolve a computation from a dictionary
        :return:
        """
        d = {
            'hashId': "abcdefg",
            'computeSteps': [
                "cX = aX + bX"
            ],
            'publicScope': {
                "aX": "12324",
                "bX": "13422"
            }
        }

        computation = self.computation_resolver.from_dict(d)

        self.assertEqual(
            computation.get_hash_id(),
            "abcdefg"
        )

        self.assertEqual(
            computation.get_compute_steps(),
            d['computeSteps']
        )

        self.assertEqual(
            computation.get_public_scope(),
            d['publicScope']
        )
