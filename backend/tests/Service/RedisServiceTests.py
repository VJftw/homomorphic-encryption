"""

tests.Service.RedisService
"""

import unittest
import mock
from mock import patch
from HomomorphicEncryptionBackend.Service.RedisService import RedisService


class RedisServiceTests(unittest.TestCase):
    """
    Tests for RedisService
    """

    @patch('redis.StrictRedis')
    def test_get(self, redis_mock):
        """
        :return:
        """
        decoded = mock.Mock()
        decoded.decode = mock.Mock(return_value="abcdef")
        redis = mock.Mock()
        redis.get = mock.Mock(return_value=decoded)
        redis_mock.return_value = redis

        redis_service = RedisService()

        self.assertEqual(
            redis_service.get("aaa"),
            "abcdef"
        )

    @patch('redis.StrictRedis')
    def test_redis_ip(self, redis_mock):
        """
        RedisService.__init__ - IP address should be retrieved from environment if exists
        :return:
        """
        with patch.dict('os.environ', REDIS_HOST="233.44.3.2"):

            redis_service = RedisService()

            redis_mock.assert_called_with(db=0, host="233.44.3.2", port=6379)

