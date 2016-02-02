"""
HomomorphicEncryptionBackend.Encoder.JSONEncoder
"""
# coding=utf-8

import json

__author__ = "VJ Patel (vj@vjpatel.me)"


class JsonEncoder(json.JSONEncoder):
    """
    JSONEncoder
    """

    def default(self, obj):
        """
        :param obj:
        :return {} :
        """
        return obj.to_json()
