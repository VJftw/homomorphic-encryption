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
                 encryption,
                 logger,
                 socket_manager):
        Thread.__init__(self)
        self.daemon = True
        self.__logger = logger
        self.__socket_manager = socket_manager

        self.__computation = computation
        self.__encryption = encryption

    def get_socket_manager(self):
        return self.__socket_manager

    def run(self):
        self.__logger.debug("Thread running")
        self.__computation.set_state(Computation.STATE_STARTED)
        # self.__socket_manager.send_message(self.__computation)
        
        self.__computation = self.__encryption.compute(self.__computation, self.__socket_manager)

        self.__computation.set_state(Computation.STATE_COMPLETE)

        self.__socket_manager.send_message(self.__computation)

        self.__logger.debug("Thread stopped")
        pass

    def stop(self):
        pass
