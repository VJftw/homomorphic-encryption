"""
tests.Resolver.KeyResolver
"""

import unittest
from HomomorphicEncryptionBackend.Resolver.KeyResolver import KeyResolver


class KeyResolverTests(unittest.TestCase):
    """
    Tests for KeyResolver
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.key_resolver = KeyResolver()

    def test_public_from_dict(self):
        """
        KeyResolver.public_from_dict - it should return a public key from a dictionary
        :return:
        """
        p_k_dict = {
            'n': "4",
            'nSq': "16",
            'g': "123"
        }

        public_key = self.key_resolver.public_from_dict(p_k_dict)

        self.assertEqual(
            public_key.get_n(),
            4
        )

        self.assertEqual(
            public_key.get_n_sq(),
            16
        )

        self.assertEqual(
            public_key.get_g(),
            123
        )
