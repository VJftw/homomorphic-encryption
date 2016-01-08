"""
HomomorphicEncryptionBackend.Service.RedisService
"""
# coding=utf-8

import redis
import os

__author__ = "VJ Patel (vj@vjpatel.me)"


class RedisService:

    def __init__(self):
        ip = "0.0.0.0"
        if 'REDIS_HOST' in os.environ:
            ip = os.environ['REDIS_HOST']
        self.__r = redis.StrictRedis(
            host=ip,
            port=6379,
            db=0
        )

    def get(self, key):
        """
        :param key:
        :return:
        """
        return self.__r.get(key).decode('utf8')

    def set(self, key, value):
        """
        :param key:
        :param value:
        :return:
        """
        self.__r.set(key, value)

        return self
