"""
HomomorphicEncryptionBackend.Resolver.ComputationResolver
"""

from injector import inject
import dateutil.parser
from HomomorphicEncryptionBackend.Model.Computation import Computation
from HomomorphicEncryptionBackend.Resolver.KeyResolver import KeyResolver
from HomomorphicEncryptionBackend.Resolver.StageResolver import StageResolver
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager

__author__ = "VJ Patel (vj@vjpatel.me)"


class ComputationResolver:
    """
    ComputationResolver
    """

    @inject(
        key_resolver=KeyResolver,
        stage_resolver=StageResolver,
        log_manager=LogManager)
    def __init__(self, key_resolver, stage_resolver, log_manager):
        """
        :return:
        """
        self.__key_resolver = key_resolver
        self.__stage_resolver = stage_resolver
        self.__logger = log_manager.get_logger('ComputationResolver')
        pass

    def from_dict(self, computation_dict):
        """
        :param computation_dict:
        :return:
        """
        c = Computation()

        c.set_hash_id(computation_dict['hashId'])
        c.set_scheme(computation_dict['scheme'])
        c.set_a_encrypted(int(computation_dict['aEncrypted']))
        c.set_b_encrypted(int(computation_dict['bEncrypted']))

        c.set_public_key(
            self.__key_resolver.public_from_dict(computation_dict['publicKey'])
        )

        for stage_dict in computation_dict['stages']:
            c.add_stage(
                self.__stage_resolver.from_dict(stage_dict)
            )

        timestamp = dateutil.parser.parse(computation_dict['timestamp'])
        c.set_timestamp(timestamp)

        return c
