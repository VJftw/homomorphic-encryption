"""
HomomorphicEncryptionBackend.HomomorphicEncryptionBackend
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Router.MessageRouter import MessageRouter

__author__ = 'VJ Patel (vj@vjpatel.me)'


class HomomorphicEncryptionBackend:
    """
    HomomorphicEncryptionBackend
    """

    @inject(log_manager=LogManager,
            message_router=MessageRouter)
    def __init__(self,
                 log_manager,
                 message_router):
        """
        :param LogManager log_manager:
        :return:
        """
        self.__log_manager = log_manager
        self.__message_router = message_router

    def get_log_manager(self):
        """
        :return LogManager:
        """
        return self.__log_manager

    def get_message_router(self):
        """
        :return MessageRouter:
        """
        return self.__message_router
