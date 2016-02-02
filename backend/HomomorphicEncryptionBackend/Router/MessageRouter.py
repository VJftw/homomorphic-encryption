"""
HomomorphicEncryptionBackend.Router.MessageRouter
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Controller.ComputationController import ComputationController

__author__ = "VJ Patel (vj@vjpatel.me)"


class MessageRouter(object):
    """
    MessageRouter
    """

    @inject(log_manager=LogManager,
            computation_controller=ComputationController)
    def __init__(self,
                 log_manager,
                 computation_controller):
        """
        :param LogManager log_manager:
        :param ComputationController computation_controller:
        :return:
        """
        self.__logger = log_manager.get_logger('message-router')
        self.__computation_controller = computation_controller

    def resolve(self, message, socket):
        """
        :param {} message:
        :param socket:
        :return: None
        """
        action = message['action']
        data = message['data']

        if action == "computation/compute":
            self.__computation_controller.compute(data, socket)
        else:
            self.__logger.error("Unable to resolve action'{0}' from {1}".format(action, message))
