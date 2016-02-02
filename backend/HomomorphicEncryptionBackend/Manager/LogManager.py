"""
HomomorphicEncryptionBackend.Manager.LogManager
"""
# coding=utf-8
import logging

__author__ = "VJ Patel (vj@vjpatel.me)"


class LogManager:
    """
    LogManager
    """

    def __init__(self):
        self.__loggers = {}
        self.__log_dir = 'logs/'

        # Trollius Logger
        logger = logging.getLogger("trollius")
        formatter = logging.Formatter('%(asctime)s - %(levelname)s: %(message)s')
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

    def get_logger(self, name):
        """
        :param name:
        :return: Logger
        """
        if name not in self.__loggers.keys():
            self.__loggers[name] = self.__set_up_logger(name)

        return self.__loggers[name]

    def __set_up_logger(self, name):
        """
        :param name:
        :return: Logger
        """
        logger = logging.getLogger(name)

        # Logging to STDOUT
        formatter = logging.Formatter('%(asctime)s - %(name)s/%(levelname)s: %(message)s')
        stream_handler = logging.StreamHandler()
        stream_handler.setFormatter(formatter)
        logger.addHandler(stream_handler)

        logger.setLevel('DEBUG')

        return logger
