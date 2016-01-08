"""
HomomorphicEncryptionBackend.Provider.ComputationThreadProvider
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Thread.ComputationThread import ComputationThread
from HomomorphicEncryptionBackend.Manager.SocketManager import SocketManager


class ComputationThreadProvider:
    """
    ComputationThreadProvider
    """

    @inject(log_manager=LogManager)
    def __init__(self,
                 log_manager):
        self.__log_manager = log_manager
        pass

    def create(self, computation):
        logger = self.__log_manager.get_logger("{0}-computation".format(computation.get_hash_id()))
        socket_manager = SocketManager(logger)

        return ComputationThread(
            computation,
            logger,
            socket_manager
        )
