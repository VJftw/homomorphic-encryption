"""
HomomorphicEncryptionBackend.Provider.EncryptionProvider
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Encryption.PaillerEncryption import PaillerEncryption
from HomomorphicEncryptionBackend.Encryption.ElGamalECC import ElGamalECCEncryption

__author__ = "VJ Patel (vj@vjpatel.me)"


class EncryptionProvider:
    """
    EncryptionProvider
    """

    @inject(pailler_encryption=PaillerEncryption,
            el_gamal_ecc_encryption=ElGamalECCEncryption)
    def __init__(self, pailler_encryption, el_gamal_ecc_encryption):
        self.__pailler_encryption = pailler_encryption
        self.__el_gamal_ecc_encryption = el_gamal_ecc_encryption

    def get_encryption_by_name(self, name):
        if name == "Pailler":
            return self.__pailler_encryption
        elif name == "ElGamal_ECC":
            return self.__el_gamal_ecc_encryption
