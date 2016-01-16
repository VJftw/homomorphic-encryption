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
        self.key_resolver = mock.Mock()
        self.stage_resolver = mock.Mock()
        self.log_manager = mock.Mock()

        self.computation_resolver = ComputationResolver(
            self.key_resolver,
            self.stage_resolver,
            self.log_manager
        )

    def test_from_dict(self):
        """
        ComputationResolver.from_dict - it should resolve a computation from a dictionary
        :return:
        """
        pub_key = mock.Mock()
        self.key_resolver.public_from_dict = mock.Mock(return_value=pub_key)

        stage = mock.Mock()
        self.stage_resolver.from_dict = mock.Mock(return_value=stage)
        d = {
            'hashId': "abcdefg",
            'scheme': "Pailler",
            'operator': "+",
            'aEncrypted': "123123123",
            'bEncrypted': "456456456",
            'publicKey': {
            },
            'stages': [
                {}
            ],
            'timestamp': "2015-04-03 12:34:21"
        }

        computation = self.computation_resolver.from_dict(d)

        self.assertEqual(
            computation.get_hash_id(),
            "abcdefg"
        )

        self.assertEqual(
            computation.get_scheme(),
            "Pailler"
        )

        self.assertEqual(
            computation.get_operation(),
            "+"
        )

        self.assertEqual(
            computation.get_a_encrypted(),
            123123123
        )

        self.assertEqual(
            computation.get_b_encrypted(),
            456456456
        )

        self.assertEqual(
            computation.get_public_key(),
            pub_key
        )

        self.assertEqual(
            computation.get_stages(),
            [stage]
        )

        self.assertEqual(
            str(computation.get_timestamp()),
            "2015-04-03 12:34:21"
        )
