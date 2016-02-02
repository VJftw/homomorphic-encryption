"""
tests.Provider.ComputationProvider
"""
# coding=utf-8

import unittest
import mock
from HomomorphicEncryptionBackend.Provider.ComputationProvider import ComputationProvider


class ComputationProviderTests(unittest.TestCase):
    """
    Tests for ComputationProvider
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.redis_service = mock.Mock()
        self.log_manager = mock.Mock()
        self.computation_resolver = mock.Mock()

        self.computation_provider = ComputationProvider(
            self.redis_service,
            self.log_manager,
            self.computation_resolver
        )

    def test_get_computation_by_hash_success(self):
        """
        ComputationProvider.get_computation_by_hash - it should return the computation on success
        :return:
        """
        computation_json = '{"hashId": "abcdef"}'
        self.redis_service.get = mock.Mock(return_value=computation_json)

        computation = mock.Mock()
        self.computation_resolver.from_dict = mock.Mock(return_value=computation)

        self.assertEqual(
            self.computation_provider.get_computation_by_hash("abcdef"),
            computation
        )

    def test_get_computation_by_hash_fail(self):
        """
        ComputationProvider.get_computation_by_hash - it should raise an exception if hash was not found
        :return:
        """
        self.redis_service.get = mock.Mock(return_value=None)

        with self.assertRaises(Exception):
            self.computation_provider.get_computation_by_hash("aaa")


