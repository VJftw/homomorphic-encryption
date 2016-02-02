"""
tests.Model.Computation
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Model.Computation import Computation


class ComputationTests(unittest.TestCase):
    """
    Tests for Computation
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.computation = Computation()

    def test_get_hash_id(self):
        """
        Computation.get_hash_id - it should return the hash id
        :return:
        """
        self.assertEqual(
            self.computation.get_hash_id(),
            None
        )

    def test_set_hash_id(self):
        """
        Computation.set_hash_id - it should set the hash id
        :return:
        """
        self.assertEqual(
            self.computation.set_hash_id("abcdef"),
            self.computation
        )

        self.assertEqual(
            self.computation.get_hash_id(),
            "abcdef"
        )

