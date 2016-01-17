"""
HomomorphicEncryptionBackend.Provider.SocketManagerProvider
"""
# coding=utf-8

from HomomorphicEncryptionBackend.Manager.SocketManager import SocketManager


class SocketManagerProvider:
    """
    SocketManagerProvider
    """

    def create(self, logger):
        """
        :param logger.Logger logger:
        :return SocketManager:
        """
        return SocketManager(logger)
