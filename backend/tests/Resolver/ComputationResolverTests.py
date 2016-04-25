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
        self.redis_service = mock.Mock()

        self.computation_resolver = ComputationResolver(
            self.log_manager,
            self.redis_service
        )

    def test_from_dict(self):
        """
        ComputationResolver.from_dict - it should resolve a computation from a dictionary
        :return:
        """
        d = {
            'hashId': "abcdefg",
            'authToken': "zxcvb",
            'computeSteps': [
                "cX = aX + bX"
            ],
            'publicScope': {
                "aX": "12324",
                "bX": "13422"
            }
        }

        self.redis_service.get = mock.Mock(return_value="zxcvb")

        computation = self.computation_resolver.from_dict(d)

        self.assertEqual(
            computation.get_hash_id(),
            "abcdefg"
        )

        self.assertEqual(
            computation.get_auth_token(),
            "zxcvb"
        )

        self.assertEqual(
            computation.get_compute_steps(),
            d['computeSteps']
        )

        self.assertEqual(
            computation.get_public_scope(),
            d['publicScope']
        )

    def test_should_through_exception_for_invalid_token(self):
        """
        ComputationResolver.from_dict - it should throw an exception when the auth token is invalid
        :return:
        """
        d = {
            'hashId': "abcdefg",
            'authToken': "aaaaaa",
            'computeSteps': [
                "cX = aX + bX"
            ],
            'publicScope': {
                "aX": "12324",
                "bX": "13422"
            }
        }

        self.redis_service.get = mock.Mock(return_value=None)

        with self.assertRaises(Exception):
            self.computation_resolver.from_dict(d)
