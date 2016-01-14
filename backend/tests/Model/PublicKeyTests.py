"""
tests.Model.PublicKey
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Model.PublicKey import PublicKey


class PublicKeyTests(unittest.TestCase):
    """
    Tests for PublicKey
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.public_key = PublicKey(
            4,
            16,
            6
        )

    def test_get_n(self):
        """
        PublicKey.get_n - it should return the value of n
        """
        self.assertEqual(
            self.public_key.get_n(),
            4
        )

    def test_get_n_sq(self):
        """
        PublicKey.get_n_sq - it should return the value of n_sq
        """
        self.assertEqual(
            self.public_key.get_n_sq(),
            16
        )

    def test_get_g(self):
        """
        PublicKey.get_g - it should return the value of g
        """
        self.assertEqual(
            self.public_key.get_g(),
            6
        )

    def test_to_json(self):
        """
        PublicKey.to_json - it should return a json representation of the PublicKey
        """
        j = {
            'n': "4",
            'nSq': "16",
            'g': "6"
        }
        self.assertEqual(
            self.public_key.to_json(),
            j
        )
