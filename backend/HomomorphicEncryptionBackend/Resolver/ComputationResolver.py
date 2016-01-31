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
        log_manager=LogManager)
    def __init__(self, log_manager):
        """
        :return:
        """
        self.__logger = log_manager.get_logger('ComputationResolver')

    def from_dict(self, computation_dict):
        """
        :param computation_dict:
        :return:
        """
        c = Computation()

        c.set_hash_id(computation_dict['hashId'])
        c.set_compute_steps(computation_dict['computeSteps'])
        c.set_public_scope(computation_dict['publicScope'])

        return c
