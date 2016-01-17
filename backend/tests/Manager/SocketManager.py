"""
tests.Manager.SocketManager
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Manager.SocketManager import SocketManager


class SocketManagerTests(unittest.TestCase):
    """
    Tests for SocketManager
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.logger = mock.Mock()
        self.socket_manager = SocketManager(self.logger)

    def test_get_sockets(self):
        """
        SocketManager.get_sockets - it should return the sockets
        :return:
        """
        self.assertEqual(
            self.socket_manager.get_sockets(),
            []
        )

    def test_add_socket(self):
        """
        SocketManager.add_socket - it should add a socket
        :return:
        """
        s = mock.Mock()
        self.assertEqual(
            self.socket_manager.add_socket(s),
            self.socket_manager
        )

        self.assertEqual(
            self.socket_manager.get_sockets(),
            [s]
        )

    def test_remove_socket(self):
        """
        SocketManager.remove_socket - it should remove a socket
        :return:
        """
        s = mock.Mock()
        self.socket_manager.add_socket(s)

        self.assertEqual(
            self.socket_manager.remove_socket(s),
            self.socket_manager
        )

        self.assertEqual(
            self.socket_manager.get_sockets(),
            []
        )

    def test_send_message_success(self):
        """
        SocketManager.send_message - it should send a message to the web sockets successfully
        :return:
        """
        pass
