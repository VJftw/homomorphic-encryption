"""
tests.Model.Computation
"""

import unittest
import mock
from HomomorphicEncryptionBackend.Model.Computation import Computation


class ComputationTests(unittest.TestCase):
    """
    Tests for Computation
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        self.computation = Computation()

    def test_get_hash_id(self):
        """
        Computation.get_hash_id - it should return the hash id
        :return:
        """
        self.assertEqual(
            self.computation.get_hash_id(),
            None
        )

    def test_set_hash_id(self):
        """
        Computation.set_hash_id - it should set the hash id
        :return:
        """
        self.assertEqual(
            self.computation.set_hash_id("abcdef"),
            self.computation
        )

        self.assertEqual(
            self.computation.get_hash_id(),
            "abcdef"
        )

    def test_get_compute_steps(self):
        """
        Computation.get_compute_steps - it should return the computation steps
        :return:
        """
        self.assertEqual(
            self.computation.get_compute_steps(),
            []
        )

    def test_set_compute_steps(self):
        """
        Computation.set_compute_steps - it should set the computation steps
        :return:
        """
        self.assertEqual(
            self.computation.set_compute_steps([1, 4]),
            self.computation
        )

        self.assertEqual(
            self.computation.get_compute_steps(),
            [1, 4]
        )

    def test_remove_compute_step(self):
        """
        Computation.remove_compute_step - it should a computation step
        :return:
        """
        self.computation.set_compute_steps([3, 5])

        self.assertEqual(
            self.computation.remove_compute_step(3),
            self.computation
        )

        self.assertEqual(
            self.computation.get_compute_steps(),
            [5]
        )

    def test_get_public_scope(self):
        """
        Computation.get_public_scope - it should return the public scope
        :return:
        """
        self.assertEqual(
            self.computation.get_public_scope(),
            {}
        )

    def test_set_public_scope(self):
        """
        Computation.set_public_scope - it should set the public scope
        :return:
        """
        self.assertEqual(
            self.computation.set_public_scope({
                'p': 5
            }),
            self.computation
        )

        self.assertEqual(
            self.computation.get_public_scope(),
            {
                'p': 5
            }
        )

    def test_add_public_scope(self):
        """
        Computation.add_public_scope - it should add to the public scope
        :return:
        """
        self.assertEqual(
            self.computation.add_public_scope('r', 3),
            self.computation
        )

        self.assertEqual(
            self.computation.get_public_scope(),
            {
                'r': 3
            }
        )

    def test_get_results(self):
        """
        Computation.get_results - it should return the results
        :return:
        """
        self.assertEqual(
            self.computation.get_results(),
            []
        )

    def test_add_result(self):
        """
        Computation.add_result - it should add a result
        :return:
        """
        self.assertEqual(
            self.computation.add_result(4),
            self.computation
        )

        self.assertEqual(
            self.computation.get_results(),
            [4]
        )

    def test_to_json(self):
        """
        Computation.to_json - it should return a dict repr of the object
        :return:
        """
        self.computation.set_hash_id("abcd")
        self.computation.set_compute_steps([6, 5])
        self.computation.set_public_scope({
            'q': 5
        })
        self.computation.add_result(3)

        self.assertEqual(
            self.computation.to_json(),
            {
                "hashId": "abcd",
                "computeSteps": [6, 5],
                "publicScope": {
                    'q': 5
                },
                "results": [3]
            }
        )
