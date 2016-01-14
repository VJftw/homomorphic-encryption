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

    def test_get_scheme(self):
        """
        Computation.get_scheme - it should return the scheme
        """
        self.assertEqual(
            self.computation.get_scheme(),
            None
        )

    def test_set_scheme(self):
        """
        Computation.set_scheme - it should set the scheme
        """
        self.assertEqual(
            self.computation.set_scheme("pailler"),
            self.computation
        )

        self.assertEqual(
            self.computation.get_scheme(),
            "pailler"
        )

    def test_get_a_encrypted(self):
        """
        Computation.get_a_encrypted - it should return the encrypted value of a
        """
        self.assertEqual(
            self.computation.get_a_encrypted(),
            None
        )

    def test_set_a_encrypted(self):
        """
        Computation.set_a_encrypted - it should set the encrypted value of a
        """
        self.assertEqual(
            self.computation.set_a_encrypted(13213123),
            self.computation
        )

        self.assertEqual(
            self.computation.get_a_encrypted(),
            13213123
        )

    def test_get_b_encrypted(self):
        """
        Computation.get_b_encrypted - it should return the encrypted value of b
        """
        self.assertEqual(
            self.computation.get_b_encrypted(),
            None
        )

    def test_set_b_encrypted(self):
        """
        Computation.set_b_encrypted - it should set the encrypted value of b
        """
        self.assertEqual(
            self.computation.set_b_encrypted(3434343),
            self.computation
        )

        self.assertEqual(
            self.computation.get_b_encrypted(),
            3434343
        )

    def test_get_public_key(self):
        """
        Computation.get_public_key - it should return the public key
        """
        self.assertEqual(
            self.computation.get_public_key(),
            None
        )

    def test_set_public_key(self):
        """
        Computation.set_public_key - it should set the public key
        """
        public_key = mock.Mock()
        self.assertEqual(
            self.computation.set_public_key(public_key),
            self.computation
        )

        self.assertEqual(
            self.computation.get_public_key(),
            public_key
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

    def test_get_stages(self):
        """
        Computation.get_stages - it should return the stages
        """
        self.assertEqual(
            self.computation.get_stages(),
            []
        )

    def test_add_stage(self):
        """
        Computation.add_stage - it should add a stage
        """
        stage = mock.Mock()

        self.assertEqual(
            self.computation.add_stage(stage),
            self.computation
        )

        self.assertEqual(
            self.computation.get_stages(),
            [stage]
        )

    def test_to_json(self):
        """
        Computation.to_json - it should return a dict representation
        :return:
        """
        public_key = mock.Mock()
        j = {
            'hashId': "abcdef",
            'scheme': "pailler",
            'aEncrypted': "34",
            'bEncrypted': "45",
            'publicKey': public_key,
            'stages': [],
            'timestamp': "2015-04-03 12:34:21",
            'state': Computation.STATE_COMPLETE
        }
        self.computation.set_hash_id("abcdef")
        self.computation.set_scheme("pailler")
        self.computation.set_a_encrypted(34)
        self.computation.set_b_encrypted(45)
        self.computation.set_public_key(public_key)
        self.computation.set_timestamp("2015-04-03 12:34:21")
        self.computation.set_state(Computation.STATE_COMPLETE)
    
        self.assertEqual(
            self.computation.to_json(),
            j
        )
