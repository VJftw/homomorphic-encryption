"""
HomomorphicEncryptionBackend.Provider.ComputationThreadProvider
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Thread.ComputationThread import ComputationThread
from HomomorphicEncryptionBackend.Provider.SocketManagerProvider import SocketManagerProvider
from HomomorphicEncryptionBackend.Encryption.Computer import Computer


class ComputationThreadProvider:
    """
    ComputationThreadProvider
    """

    @inject(log_manager=LogManager,
            socket_manager_provider=SocketManagerProvider,
            computer=Computer)
    def __init__(self,
                 log_manager,
                 socket_manager_provider,
                 computer):
        self.__log_manager = log_manager
        self.__socket_manager_provider = socket_manager_provider
        self.__computer = computer

    def create(self, computation):
        logger = self.__log_manager.get_logger("{0}-computation".format(computation.get_hash_id()))
        socket_manager = self.__socket_manager_provider.create(logger)

        return ComputationThread(
            computation,
            self.__computer,
            logger,
            socket_manager
        )
