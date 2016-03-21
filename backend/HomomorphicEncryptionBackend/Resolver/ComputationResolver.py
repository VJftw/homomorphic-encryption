"""
HomomorphicEncryptionBackend.Resolver.ComputationResolver
"""

from injector import inject
from HomomorphicEncryptionBackend.Model.Computation import Computation
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Service.RedisService import RedisService

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationResolver:
    """
    ComputationResolver
    """

    @inject(
        log_manager=LogManager,
        redis_service=RedisService)
    def __init__(self,
                 log_manager,
                 redis_service):
        """
        :param LogManager log_manager:
        :param RedisService redis_service:
        :return:
        """
        self.__logger = log_manager.get_logger('ComputationResolver')
        self.__redis_service = redis_service

    def from_dict(self, computation_dict):
        """
        :param computation_dict:
        :return:
        """
        c = Computation()

        c.set_hash_id(computation_dict['hashId'])
        c.set_auth_token(computation_dict['authToken'])

        computation_auth_token = self.__redis_service.get("computation:{0}".format(c.get_hash_id()))

        if computation_auth_token != c.get_auth_token():
            raise Exception("{0} != {1}".format(computation_auth_token, c.get_auth_token()))

        c.set_compute_steps(computation_dict['computeSteps'])
        c.set_public_scope(computation_dict['publicScope'])

        return c
