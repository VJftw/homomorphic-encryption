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
        self.el_gamal_ecc = mock.Mock()
        self.encryption_provider = EncryptionProvider(
            self.pailler,
            self.el_gamal_ecc
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

    def test_get_encryption_by_name_el_gamal_ecc(self):
        """
        EncryptionProvider.get_encryption_by_name - it should return the ElGamal ECC encryption
        :return:
        """
        self.assertEqual(
            self.encryption_provider.get_encryption_by_name("ElGamal_ECC"),
            self.el_gamal_ecc
        )
