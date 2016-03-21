"""
ComputationProvider
"""
# coding=utf-8

from injector import inject
from HomomorphicEncryptionBackend.Service.RedisService import RedisService
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager
from HomomorphicEncryptionBackend.Resolver.ComputationResolver import ComputationResolver
import json

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationProvider:
    """
    ComputationProvider
    """

    @inject(redis_service=RedisService,
            log_manager=LogManager,
            computation_resolver=ComputationResolver)
    def __init__(self,
                 redis_service,
                 log_manager,
                 computation_resolver):
        self.__redis_service = redis_service
        self.__logger = log_manager.get_logger("Redis")
        self.__computation_resolver = computation_resolver

    def get_computation_by_hash(self, hash_id):
        computation_json = self.__redis_service.get("computation:{0}".format(hash_id))

        if not computation_json:
            raise Exception("Computation not Found in Redis.")

        computation_dict = json.loads(computation_json)

        computation = self.__computation_resolver.from_dict(computation_dict)
        self.__logger.debug(computation.to_json())

        return computation
