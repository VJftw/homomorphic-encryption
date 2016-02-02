"""
tests.Controller.ComputationController
"""
# coding=utf-8

import unittest
import mock
from HomomorphicEncryptionBackend.Controller.ComputationController import ComputationController


class ComputationControllerTests(unittest.TestCase):
    """
    Tests for ComputationController
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.computation_resolver = mock.Mock()
        self.computation_thread_provider = mock.Mock()
        self.computation_controller = ComputationController(
            self.computation_resolver,
            self.computation_thread_provider
        )

    def test_compute(self):
        """
        ComputationController.compute - it should start a computation
        :return:
        """
        computation = mock.Mock()
        self.computation_resolver.get_computation_by_hash = mock.Mock(return_value=computation)

        computation_thread = mock.Mock()
        socket_manager = mock.Mock()
        socket_manager.add_socket = mock.Mock()
        computation_thread.get_socket_manager = mock.Mock(return_value=socket_manager)
        computation_thread.start = mock.Mock()

        self.computation_thread_provider.create = mock.Mock(return_value=computation_thread)

        socket = mock.Mock()
        self.computation_controller.compute({
            'hashId': "abcd"
        }, socket)

        socket_manager.add_socket.assert_called_with(socket)
        assert computation_thread.start.called
