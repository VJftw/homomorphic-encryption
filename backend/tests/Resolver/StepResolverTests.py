"""
tests.Resolver.StepResolver
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Resolver.StepResolver import StepResolver


class StepResolverTests(unittest.TestCase):
    """
    Tests for StepResolver
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.step_resolver = StepResolver()

    def test_from_dict_no_result(self):
        """
        StepResolver.from_dict - it should return a Step from a dictionary if there is no result
        :return:
        """
        step_dict = {
            'action': "Add 1 + 1",
            'timestamp': "TIMESTAMP"
        }

        step = self.step_resolver.from_dict(step_dict)

        self.assertEqual(
            step.get_action(),
            "Add 1 + 1"
        )

        self.assertEqual(
            step.get_timestamp(),
            "TIMESTAMP"
        )

        self.assertEqual(
            step.get_result(),
            None
        )

    def test_from_dict_with_result(self):
        """
        StepResolver.from_dict - it should return a step from a dictionary
        :return:
        """
        step_dict = {
            'action': "Add 1 + 1",
            'timestamp': "TIMESTAMP",
            'result': "123123"
        }

        step = self.step_resolver.from_dict(step_dict)

        self.assertEqual(
            step.get_action(),
            "Add 1 + 1"
        )

        self.assertEqual(
            step.get_timestamp(),
            "TIMESTAMP"
        )

        self.assertEqual(
            step.get_result(),
            "123123"
        )
