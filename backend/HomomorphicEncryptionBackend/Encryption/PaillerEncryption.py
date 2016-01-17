"""
HomomorphicEncryptionBackend.Encryption.PaillerEncryption
"""
# coding=utf-8

__author__ = "VJ Patel (vj@vjpatel.me)"

from HomomorphicEncryptionBackend.Model.Stage import Stage
from HomomorphicEncryptionBackend.Model.Step import Step
import datetime


class PaillerEncryption:
    """
    PaillerEncryption
    """

    def compute(self, computation, socket_manager):

        # operator = computation.get_operator()
        # if (operator == '+'):
        return self.e_add(computation)

    def e_add(self, computation):
        stage = Stage()
        stage.set_name("Backend")

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
