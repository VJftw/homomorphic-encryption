"""
HomomorphicEncryptionBackend.Encryption.Computer
"""

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager

__author__ = "VJ Patel (vj@vjpatel.me)"


class Computer:

    @inject(log_manager=LogManager)
    def __init__(self, log_manager):
        self.__logger = log_manager.get_logger("Computer")
        pass

    def compute(self,
                compute,
                scope):
        self.__logger.debug(compute)
        self.__logger.debug(scope)
        return 12321
