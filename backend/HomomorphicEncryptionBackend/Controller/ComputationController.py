"""
HomomorphicEncryptionBackend.Router.MessageRouter
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Resolver.ComputationResolver import ComputationResolver
from HomomorphicEncryptionBackend.Provider.ComputationThreadProvider import ComputationThreadProvider

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationController:
    """
    ComputationController
    """

    @inject(computation_resolver=ComputationResolver,
            computation_thread_provider=ComputationThreadProvider)
    def __init__(self,
                 computation_resolver,
                 computation_thread_provider):
        """
        :param ComputationResolver computation_resolver:
        :param ComputationThreadProvider computation_thread_provider:
        :return:
        """
        self.__computation_resolver = computation_resolver
        self.__computation_thread_provider = computation_thread_provider

    def compute(self, data, socket):
        """
        1) resolve Computation
        2) TODO: Cross-check with redis, could use a token
        2) start new thread and compute
        :param data:
        :param socket:
        :return:
        """
        computation = self.__computation_resolver.from_dict(data)

        computation_thread = self.__computation_thread_provider.create(computation)
        computation_thread.get_socket_manager().add_socket(socket)
        computation_thread.start()
