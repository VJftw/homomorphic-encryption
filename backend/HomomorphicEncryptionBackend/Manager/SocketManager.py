"""
HomomorphicEncryptionBackend.Manager.SocketManager
"""
import json
from HomomorphicEncryptionBackend.Encoder.JsonEncoder import JsonEncoder


class SocketManager:

    def __init__(self,
                 logger):
        self.__sockets = []
        self.__logger = logger

    def add_socket(self, socket):
        self.__sockets.append(socket)

    def remove_socket(self, socket):
        self.__sockets.remove(socket)

    def get_sockets(self):
        return self.__sockets

    def send_message(self, message):
        try:
            message = json.dumps(message, sort_keys=False, cls=JsonEncoder)
        except Exception as exc:
            self.__logger.critical("JSON ERROR: {0} in {1}".format(exc.message, message))
            raise exc

        self.__emit_message(message)

    def __emit_message(self, message):
        self.__logger.debug("Emitting to {1}: {0}".format(message, self.__sockets))
        for socket in self.__sockets:
            socket.sendMessage(message.encode('utf-8'))
