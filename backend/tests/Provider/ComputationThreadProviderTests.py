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
        self.computation_thread_provder = ComputationThreadProvider(
                self.log_manager,
                self.socket_manager_provider
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
        encryption = mock.Mock()

        thread = self.computation_thread_provder.create(
            computation,
            encryption
        )

        self.assertEqual(
            thread.get_socket_manager(),
            socket_manager
        )
