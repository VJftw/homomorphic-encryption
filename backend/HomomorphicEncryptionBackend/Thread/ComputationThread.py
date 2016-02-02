"""
HomomorphicEncryptionBackend.Thread.ComputationThread
"""
# coding=utf-8

from threading import Thread
from HomomorphicEncryptionBackend.Model.Computation import Computation
import time


class ComputationThread(Thread):
    """
    ComputationThread
    """

    def __init__(self,
                 computation,
                 computer,
                 logger,
                 socket_manager):
        Thread.__init__(self)
        self.daemon = True
        self.__logger = logger
        self.__socket_manager = socket_manager

        self.__computation = computation
        self.__computer = computer

    def get_socket_manager(self):
        return self.__socket_manager

    def run(self):
        self.__logger.debug("Thread running")

        compute_steps = self.__computation.get_compute_steps()

        for step in compute_steps:
            var_name = step.split(" = ")[0]
            compute = step.split(" = ")[1]
            result = self.__computer.compute(compute, self.__computation.get_public_scope())

            self.__computation.add_public_scope(var_name, "{0}".format(result))
            self.__computation.add_result("{0}".format(result))
            self.__computation.remove_compute_step(step)
            self.__socket_manager.send_message(self.__computation)

        self.__logger.debug("Thread stopped")
