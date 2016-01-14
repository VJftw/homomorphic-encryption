"""
HomomorphicEncryptionBackend.Router.MessageRouter
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Provider.ComputationProvider import ComputationProvider
from HomomorphicEncryptionBackend.Provider.EncryptionProvider import EncryptionProvider
from HomomorphicEncryptionBackend.Provider.ComputationThreadProvider import ComputationThreadProvider
from HomomorphicEncryptionBackend.Model.Computation import Computation

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationController:
    """
    ComputationController
    """

    @inject(computation_provider=ComputationProvider,
            encryption_provider=EncryptionProvider,
            computation_thread_provider=ComputationThreadProvider)
    def __init__(self,
                 computation_provider,
                 encryption_provider,
                 computation_thread_provider):
        """
        :param ComputationProvider computation_provider:
        :param EncryptionProvider encryption_provider:
        :param ComputationThreadProvider computation_thread_provider:
        :return:
        """
        self.__computation_provider = computation_provider
        self.__encryption_provider = encryption_provider
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
        encryption = self.__encryption_provider.get_encryption_provider_by_name(computation.get_scheme())

        computation_thread = self.__computation_thread_provider.create(computation, encryption)
        computation_thread.get_socket_manager().add_socket(socket)
        computation_thread.start()

        pass
