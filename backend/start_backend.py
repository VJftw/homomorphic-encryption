"""
HomomorphicEncryptionBackend
"""
# coding=utf-8

from HomomorphicEncryptionBackend.Protocol.WebSocketProtocol import WebSocketProtocol
from autobahn.asyncio.websocket import WebSocketServerFactory
from HomomorphicEncryptionBackend.HomomorphicEncryptionBackend import HomomorphicEncryptionBackend
import asyncio
import os

from injector import Injector

__author__ = "VJ Patel (vj@vjpatel.me)"

if __name__ == '__main__':

    injector = Injector()
    fhe_backend = injector.get(HomomorphicEncryptionBackend)

    log_manager = fhe_backend.get_log_manager()
    logger = log_manager.get_logger('main')

    ws_port = "9000"
    if 'WS_PORT' in os.environ:
        ws_port = os.environ['WS_PORT']

    factory = WebSocketServerFactory(
        "ws://{0}".format("0.0.0.0:{0}".format(ws_port)),
        debug=True
    )
    factory.protocol = WebSocketProtocol

    loop = asyncio.get_event_loop()
    coro = loop.create_server(factory, "0.0.0.0", ws_port)
    server = loop.run_until_complete(coro)

    logger.info("Starting Backend Server on: {0}".format("0.0.0.0:{0}".format(ws_port)))
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()
