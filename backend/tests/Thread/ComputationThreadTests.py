"""
tests.Thread.ComputationThread
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Thread.ComputationThread import ComputationThread
from HomomorphicEncryptionBackend.Model.Computation import Computation
from HomomorphicEncryptionBackend.Encryption.Computer import Computer


class ComputationThreadTests(unittest.TestCase):
    """
    Tests for ComputationThread
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.computation = Computation()
        self.logger = mock.Mock()
        self.computer = Computer(self.logger)
        self.socket_manager = mock.Mock()

        self.computation_thread = ComputationThread(
            self.computation,
            self.computer,
            self.logger,
            self.socket_manager
        )

    def test_it_should_be_daemon(self):
        """
        ComputationThread - it should be daemon, so that it shuts down at the end of the main process
        :return:
        """
        self.assertEqual(
            self.computation_thread.daemon,
            True
        )

    def test_it_should_return_the_socket_manager(self):
        """
        ComputationThread.get_socket_manager - it should return the SocketManager
        :return:
        """
        self.assertEqual(
            self.computation_thread.get_socket_manager(),
            self.socket_manager
        )

    def test_it_should_run(self):
        """
        ComputationThread.run - it should run the computation
        :return:
        """
        self.socket_manager.send_message = mock.Mock()

        self.computation.set_compute_steps([
            "cX = aX + bX"
        ])
        self.computation.set_public_scope({
            "aX": "1342",
            "bX": "4343"
        })

        self.computation_thread.run()

        self.assertEqual(
            self.computation.get_compute_steps(),
            []
        )

        self.assertEqual(
            self.computation.get_public_scope(),
            {
                "aX": "1342",
                "bX": "4343",
                "cX": "5685"
            }
        )

        self.socket_manager.send_message.assert_called_with(self.computation)
