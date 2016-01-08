"""
HomomorphicEncryptionBackend.Protocol.WebSocketProtocol
"""
# coding=utf-8

from autobahn.asyncio.websocket import WebSocketServerProtocol
import json
import traceback
from injector import Injector
from HomomorphicEncryptionBackend.HomomorphicEncryptionBackend import HomomorphicEncryptionBackend

__author__ = "VJ Patel (vj@vjpatel.me)"


class WebSocketProtocol(WebSocketServerProtocol):
    """
    WebSocketProtocol
    """

    def __init__(self):
        """
        :return:
        """
        WebSocketServerProtocol.__init__(self)
        injector = Injector()
        fhe_backend = injector.get(HomomorphicEncryptionBackend)
        log_manager = fhe_backend.get_log_manager()
        self.__logger = log_manager.get_logger('ws_protocol')

        """:type : MessageResolver"""
        self.__message_router = fhe_backend.get_message_router()

    def onOpen(self):
        """
        :return:
        """
        self.__logger.info("WebSocket connection opened.")

    def onConnect(self, request):
        """
        :param request:
        :return:
        """
        self.__logger.info("Client connected: {0}".format(request.peer))

    def onMessage(self, payload, is_binary):
        """
        :param payload:
        :param is_binary:
        :return:
        """
        if not is_binary:
            try:
                msg = json.loads(payload.decode('utf8'))
                self.__logger.debug("Message received: {0}".format(payload))

                self.__message_router.resolve(msg, self)
            except Exception as error:
                self.__logger.critical("Web Socket Error - {0}\n{1}".format(
                    error.__class__.__name__,
                    traceback.format_exc()
                ))

    def onClose(self, was_clean, code, reason):
        """
        :param was_clean:
        :param code:
        :param reason:
        :return:
        """
        self.__logger.info("WebSocket connection closed {0}: {1}".format(was_clean, reason))
        # Use ThreadManager to remove socket
