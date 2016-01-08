"""
HomomorphicEncryptionBackend.Router.MessageRouter
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Provider.ComputationProvider import ComputationProvider
from HomomorphicEncryptionBackend.Provider.ComputationThreadProvider import ComputationThreadProvider
from HomomorphicEncryptionBackend.Model.Computation import Computation

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationController:
    """
    ComputationController
    """

    @inject(computation_provider=ComputationProvider,
            computation_thread_provider=ComputationThreadProvider)
    def __init__(self,
                 computation_provider,
                 computation_thread_provider):
        """
        :param ComputationProvider computation_provider:
        :param ComputationThreadProvider computation_thread_provider:
        :return:
        """
        self.__computation_provider = computation_provider
        self.__computation_thread_provider = computation_thread_provider

    def compute(self, data, socket):
        """
        1) fetch Computation - cross-check with redis
        2) start new thread and compute
        :param data:
        :param socket:
        :return:
        """
        computation = self.__computation_provider.get_computation_by_hash(data['hashId'])

        computation_thread = self.__computation_thread_provider.create(computation)
        computation_thread.get_socket_manager().add_socket(socket)
        computation_thread.start()

        pass
