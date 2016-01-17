"""
tests.Provider.EncryptionProvider
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Provider.EncryptionProvider import EncryptionProvider


class EncryptionProviderTests(unittest.TestCase):
    """
    Tests for EncryptionProvider
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.pailler = mock.Mock()
        self.encryption_provider = EncryptionProvider(
            self.pailler
        )

    def test_get_encryption_by_name_pailler(self):
        """
        EncryptionProvider.get_encryption_by_name - it should return the Pailler encryption
        :return:
        """
        self.assertEqual(
            self.encryption_provider.get_encryption_by_name("Pailler"),
            self.pailler
        )
