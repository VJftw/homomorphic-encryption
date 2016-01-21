"""
HomomorphicEncryptionBackend.Encryption.PaillerEncryption
"""
# coding=utf-8

from HomomorphicEncryptionBackend.Model.Stage import Stage
from HomomorphicEncryptionBackend.Model.Step import Step
import datetime

__author__ = "VJ Patel (vj@vjpatel.me)"


class PaillerEncryption:
    """
    PaillerEncryption
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

        step.set_action("Calculate \\(aX \\cdot bX \\bmod n^2 \\) to get \\(cX\\)")

        a = computation.get_a_encrypted()
        b = computation.get_b_encrypted()
        pub = computation.get_public_key()

        r = a * b % pub.get_n_sq()

        step.set_result(r)

        stage.add_step(step)
        computation.add_stage(stage)

        return computation
