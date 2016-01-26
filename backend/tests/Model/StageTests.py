"""
tests.Model.Stage
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Model.Stage import Stage


class StageTests(unittest.TestCase):
    """
    Tests for Stage
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.stage = Stage()

    def test_get_name(self):
        """
        Stage.get_name - it should return the name
        """
        self.assertEqual(
            self.stage.get_name(),
            None
        )

    def test_set_name(self):
        """
        Stage.set_name - it should set the name
        """
        self.assertEqual(
            self.stage.set_name("Workspace"),
            self.stage
        )

        self.assertEqual(
            self.stage.get_name(),
            "Workspace"
        )

    def test_get_host(self):
        """
        Stage.get_host - it should return the host
        """
        self.assertEqual(
            self.stage.get_host(),
            None
        )

    def test_set_host(self):
        """
        Stage.set_host - it should set the host
        """
        self.assertEqual(
            self.stage.set_host(Stage.TYPE_SERVER),
            self.stage
        )

        self.assertEqual(
            self.stage.get_host(),
            Stage.TYPE_SERVER
        )

    def test_get_steps(self):
        """
        Stage.get_steps - it should return the steps
        """
        self.assertEqual(
            self.stage.get_steps(),
            []
        )

    def test_add_step(self):
        """
        Stage.add_step - it should add a step
        """
        step = mock.Mock()
        self.assertEqual(
            self.stage.add_step(step),
            self.stage
        )

        self.assertEqual(
            self.stage.get_steps(),
            [step]
        )

    def test_to_json(self):
        """
        Stage.to_json - it should return a json representation
        """
        j = {
            'name': "Workspace",
            'host': Stage.TYPE_SERVER,
            'steps': []
        }

        self.stage.set_name("Workspace")
        self.stage.set_host(Stage.TYPE_SERVER)

        self.assertEqual(
            self.stage.to_json(),
            j
        )
