"""
tests.Router.MessageRouter
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Router.MessageRouter import MessageRouter


class MessageRouterTests(unittest.TestCase):
    """
    Tests for MessageRouter
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.log_manager = mock.Mock()
        self.logger = mock.Mock()
        self.log_manager.get_logger = mock.Mock(return_value=self.logger)
        self.computation_controller = mock.Mock()
        self.message_router = MessageRouter(
            self.log_manager,
            self.computation_controller
        )

    def test_resolve_computation(self):
        """
        MessageRouter.resolve - it should resolve a message to the computation controller
        :return:
        """
        self.computation_controller.compute = mock.Mock()

        socket = mock.Mock()

        self.message_router.resolve({
            'action': "computation/compute",
            'data': "woop"
        }, socket)

        self.computation_controller.compute.assert_called_with("woop", socket)

    def test_resolve_fail(self):
        """
        MessageRouter.resovler - it should log an error when the resolve fails
        :return:
        """
        socket = mock.Mock()

        self.logger.error = mock.Mock()

        self.message_router.resolve({
            'action': "abcdef",
            'data': "woop"
        }, socket)

        assert self.logger.error.called
