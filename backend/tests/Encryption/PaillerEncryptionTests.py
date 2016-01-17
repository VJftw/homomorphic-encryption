"""
tests.Encryption.PaillerEncryption
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Encryption.PaillerEncryption import PaillerEncryption
from HomomorphicEncryptionBackend.Model.Computation import Computation


class PaillerEncryptionTests(unittest.TestCase):
    """
    Tests for PaillerEncryption
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.pailler_encryption = PaillerEncryption()

    def test_compute_addition(self):
        """
        PaillerEncryption.compute - it should compute addition
        :return:
        """
        socket_manager = mock.Mock()
        computation = Computation()
        computation.set_operation("+")
        computation.set_a_encrypted(2385857191446623772)
        computation.set_b_encrypted(5699064701154834086)
        public_key = mock.Mock()
        public_key.get_n_sq = mock.Mock(return_value=6682477768860329881)
        computation.get_public_key = mock.Mock(return_value=public_key)

        c = self.pailler_encryption.compute(computation, socket_manager)

        last_stage = c.get_stages()[-1]
        last_step_of_stage = last_stage.get_steps()[-1]

        self.assertEqual(
            last_stage.get_name(),
            "Backend"
        )

        self.assertEqual(
            last_step_of_stage.get_result(),
            508281515448119917
        )
