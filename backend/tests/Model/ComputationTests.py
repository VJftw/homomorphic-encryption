"""
tests.Model.Computation
"""

import unittest
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

    def test_get_timestamp(self):
        """
        Computation.get_timestamp - it should return the timestamp
        :return:
        """
        self.assertEqual(
            self.computation.get_timestamp(),
            None
        )

    def test_set_timestamp(self):
        """
        Computation.set_timestamp - it should set the timestamp
        :return:
        """
        self.assertEqual(
            self.computation.set_timestamp("2015-04-03 12:34:21"),
            self.computation
        )

        self.assertEqual(
            self.computation.get_timestamp(),
            "2015-04-03 12:34:21"
        )

    def test_get_state(self):
        """
        Computation.get_state - it should return the state
        :return:
        """
        self.assertEqual(
            self.computation.get_state(),
            None
        )

    def test_set_state(self):
        """
        Computation.set_state - it should set the state
        :return:
        """
        self.assertEqual(
            self.computation.set_state(Computation.STATE_COMPLETE),
            self.computation
        )

        self.assertEqual(
            self.computation.get_state(),
            Computation.STATE_COMPLETE
        )

    # def test_to_json(self):
    #     """
    #     Computation.to_json - it should return a dict representation
    #     :return:
    #     """
    #     j = {
    #         'hash_id': "abcdef",
    #         'problem': "3 + 6",
    #         'auth_token': "zxcvb",
    #         'timestamp': "2015-04-03 12:34:21",
    #         'state': Computation.STATE_COMPLETE
    #     }
    #     self.computation.set_hash_id("abcdef")
    #     self.computation.set_timestamp("2015-04-03 12:34:21")
    #     self.computation.set_state(Computation.STATE_COMPLETE)
    #
    #     self.assertEqual(
    #         self.computation.to_json(),
    #         j
    #     )
