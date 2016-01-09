"""
HomomorphicEncryptionBackend.Thread.ComputationThread
"""
# coding=utf-8

from threading import Thread
from HomomorphicEncryptionBackend.Model.Stage import Stage
from HomomorphicEncryptionBackend.Model.Step import Step
from HomomorphicEncryptionBackend.Model.Computation import Computation
import time
import datetime


class ComputationThread(Thread):
    """
    ComputationThread
    """

    def __init__(self,
                 computation,
                 logger,
                 socket_manager):
        Thread.__init__(self)
        self.daemon = True
        self.__logger = logger
        self.__socket_manager = socket_manager

        self.__computation = computation

    def get_socket_manager(self):
        return self.__socket_manager

    def e_add(self, pub, a, b):
        return a * b % pub.get_n_sq()

    def run(self):
        self.__logger.debug("Thread running")
        self.__computation.set_state(Computation.STATE_STARTED)
        # self.__socket_manager.send_message(self.__computation)
        stage = Stage()
        stage.set_name("Backend")

        step = Step()
        step.set_timestamp(datetime.datetime.now())

        step.set_action("Calculate \\(aX \\cdot bX \\bmod n^2 \\) to get \\(cX\\)".format(
            self.__computation.get_a_encrypted(),
            self.__computation.get_b_encrypted(),
            self.__computation.get_public_key().get_n_sq()
        ))

        r = self.e_add(
            self.__computation.get_public_key(),
            self.__computation.get_a_encrypted(),
            self.__computation.get_b_encrypted()
        )
        step.set_result(r)

        stage.add_step(step)
        self.__computation.add_stage(stage)
        self.__computation.set_state(Computation.STATE_COMPLETE)

        self.__socket_manager.send_message(self.__computation)

        self.__logger.debug("Thread stopped")
        pass

    def stop(self):
        pass
