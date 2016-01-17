"""
tests.Model.Step
"""

import unittest
from HomomorphicEncryptionBackend.Model.Step import Step
import datetime


class StepTests(unittest.TestCase):
    """
    Tests for Step
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.step = Step()

    def test_get_action(self):
        """
        Step.get_action - it should return the action
        :return:
        """
        self.assertEqual(
            self.step.get_action(),
            None
        )

    def test_set_action(self):
        """
        Step.set_action - it should set the action
        :return:
        """
        self.assertEqual(
            self.step.set_action("abcdef"),
            self.step
        )

        self.assertEqual(
            self.step.get_action(),
            "abcdef"
        )

    def test_get_result(self):
        """
        Step.get_result - it should return the result
        :return:
        """
        self.assertEqual(
            self.step.get_result(),
            None
        )

    def test_set_result(self):
        """
        Step.set_result - it should set the result
        :return:
        """
        self.assertEqual(
            self.step.set_result(123123),
            self.step
        )

        self.assertEqual(
            self.step.get_result(),
            123123
        )

    def test_get_timestamp(self):
        """
        Step.get_timestamp - it should return the timestamp
        :return:
        """
        self.assertEqual(
            self.step.get_timestamp(),
            None
        )

    def test_set_timestamp(self):
        """
        Step.set_timestamp - it should set the timestamp
        :return:
        """
        ts = datetime.datetime.now()
        self.assertEqual(
            self.step.set_timestamp(ts),
            self.step
        )

        self.assertEqual(
            self.step.get_timestamp(),
            ts
        )

    def test_to_json(self):
        """
        Step.to_json - it should return a json representation
        :return:
        """
        ts = datetime.datetime.now()
        ts_str = str(ts)

        d = {
            'action': "abcdef",
            'result': "123123",
            'timestamp': ts_str
        }

        self.step.set_action("abcdef")
        self.step.set_result(123123)
        self.step.set_timestamp(ts)

        self.assertEqual(
            self.step.to_json(),
            d
        )
