"""
tests.Manager.LogManager
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager


class LogManagerTests(unittest.TestCase):
    """
    Tests for LogManager
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.log_manager = LogManager()

    def test_get_logger(self):
        """
        LogManager.get_logger - it should return a logger with the given name
        :return:
        """
        logger = self.log_manager.get_logger("abcd")

        self.assertEqual(
            logger.name,
            "abcd"
        )

        self.assertEqual(
            logger.level,
            10
        )
