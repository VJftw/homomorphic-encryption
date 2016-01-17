"""
tests.Resolver.StageResolver
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Resolver.StageResolver import StageResolver


class StageResolverTests(unittest.TestCase):
    """
    Tests for StageResolver
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.step_resolver = mock.Mock()
        self.stage_resolver = StageResolver(self.step_resolver)

    def test_from_dict(self):
        """
        StageResolver.public_from_dict - it should return a Stage from a dictionary
        :return:
        """
        stage_dict = {
            'name': "Workspace",
            'steps': [
                "abcd"
            ]
        }

        step = mock.Mock()
        self.step_resolver.from_dict = mock.Mock(return_value=step)

        stage = self.stage_resolver.from_dict(stage_dict)

        self.assertEqual(
            stage.get_name(),
            "Workspace"
        )

        self.assertEqual(
            stage.get_steps(),
            [step]
        )
