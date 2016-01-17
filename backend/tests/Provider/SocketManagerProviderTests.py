"""
tests.Provider.SocketManagerProvider
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Provider.SocketManagerProvider import SocketManagerProvider


class SocketManagerProviderTests(unittest.TestCase):
    """
    Tests for SocketManagerProvider
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.socket_manager_provider = SocketManagerProvider()

    def test_create(self):
        """
        SocketManagerProvider.create - it should return a new SocketManager
        :return:
        """
        logger = mock.Mock()
        s_m = self.socket_manager_provider.create(logger)

        self.assertEqual(
            s_m.__class__.__name__,
            "SocketManager"
        )
