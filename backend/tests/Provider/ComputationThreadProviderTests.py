"""
tests.Provider.ComputationThreadProvider
"""
# coding=utf-8

import unittest
import mock
from HomomorphicEncryptionBackend.Provider.ComputationThreadProvider import ComputationThreadProvider


class ComputationThreadProviderTests(unittest.TestCase):
    """
    Tests for ComputationThreadProvider
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.log_manager = mock.Mock()
        self.socket_manager_provider = mock.Mock()
        self.computer = mock.Mock()

        self.computation_thread_provider = ComputationThreadProvider(
                self.log_manager,
                self.socket_manager_provider,
                self.computer
        )

    def test_create(self):
        """
        ComputationThreadProvider.create - it should return a new computation thread
        :return:
        """
        logger = mock.Mock()
        self.log_manager.get_logger = mock.Mock(return_value=logger)

        socket_manager = mock.Mock()
        self.socket_manager_provider.create = mock.Mock(return_value=socket_manager)

        computation = mock.Mock()

        thread = self.computation_thread_provider.create(
            computation
        )

        self.assertEqual(
            thread.get_socket_manager(),
            socket_manager
        )
