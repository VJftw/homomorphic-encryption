"""
tests.Thread.ComputationThread
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Thread.ComputationThread import ComputationThread
from HomomorphicEncryptionBackend.Model.Computation import Computation


class ComputationThreadTests(unittest.TestCase):
    """
    Tests for ComputationThread
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.computation = mock.Mock()
        self.encryption = mock.Mock()
        self.logger = mock.Mock()
        self.socket_manager = mock.Mock()

        self.computation_thread = ComputationThread(
            self.computation,
            self.encryption,
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
        self.computation.set_state = mock.Mock()
        self.encryption.compute = mock.Mock(return_value=self.computation)
        self.socket_manager.send_message = mock.Mock()

        self.computation_thread.run()

        self.computation.set_state.assert_has_calls([
            mock.call(Computation.STATE_STARTED),
            mock.call(Computation.STATE_COMPLETE)
        ])

        self.encryption.compute.assert_called_with(self.computation, self.socket_manager)

        self.socket_manager.send_message.assert_called_with(self.computation)
