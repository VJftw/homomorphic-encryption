"""
HomomorphicEncryptionBackend.Encryption.PaillerEncryption
"""
# coding=utf-8

from HomomorphicEncryptionBackend.Model.Stage import Stage
from HomomorphicEncryptionBackend.Model.Step import Step
import datetime

__author__ = "VJ Patel (vj@vjpatel.me)"


class ElGamalECCEncryption:
    """
    ElGamalECCEncryption
    """

    def compute(self, computation, socket_manager):
        """
        :param Computation computation:
        :param SocketManager socket_manager:
        :return Computation|None:
        """
        operator = computation.get_operation()
        if operator == '+':
            return self.__e_add(computation)

    def __e_add(self, computation):
        """
        :param Computation computation:
        :return Computation:
        """
        stage = Stage()
        stage.set_name("Server")
        stage.set_host(Stage.TYPE_SERVER)

        step = Step()
        step.set_timestamp(datetime.datetime.now())

        step.set_action("Calculate \\(aX + bX \\) to get \\(cX\\)")

        a = computation.get_a_encrypted()
        b = computation.get_b_encrypted()

        r = a + b

        step.set_result(r)

        stage.add_step(step)
        computation.add_stage(stage)

        return computation


class PublicKey:
    """
    PublicKey
    """

    def __init__(self, p, g, h):
        self.__p = p
        self.__g = g
        self.__h = h

    def get_p(self):
        return self.__p

    def get_g(self):
        return self.__g

    def get_h(self):
        return self.__h

    def to_json(self):
        return {
            'p': "{0}".format(self.get_p()),
            'g': "{0}".format(self.get_g()),
            'h': "{0}".format(self.get_h())
        }
