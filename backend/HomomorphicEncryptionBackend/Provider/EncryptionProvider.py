"""
HomomorphicEncryptionBackend.Provider.EncryptionProvider
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Encryption.PaillerEncryption import PaillerEncryption

__author__ = "VJ Patel (vj@vjpatel.me)"


class EncryptionProvider:
    """
    EncryptionProvider
    """

    @inject(pailler_encryption=PaillerEncryption)
    def __init__(self, pailler_encryption):
        self.__pailler_encryption = pailler_encryption

    def get_encryption_by_name(self, name):
        if name == "Pailler":
            return self.__pailler_encryption
