"""
tests.Encoder.JSONEncoder
"""
# coding=utf-8

import unittest
import mock
from HomomorphicEncryptionBackend.Encoder.JsonEncoder import JsonEncoder


class JSONEncoderTests(unittest.TestCase):
    """
    Tests for JSONEncoder
    """

    def setUp(self):
        """
        Set Up the instance before each Test
        :return: None
        """
        self.json_encoder = JsonEncoder()

    def test_default(self):
        """
        JSONEncoder.default - it should call to_json on an object to serialize
        :return:
        """
        o = mock.Mock()
        o.to_json = mock.Mock(return_value="WOOHOO")

        self.assertEqual(
            self.json_encoder.default(o),
            "WOOHOO"
        )
