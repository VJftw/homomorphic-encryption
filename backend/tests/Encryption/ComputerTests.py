"""
tests.Encryption.Computer
"""

import unittest
import mock

from HomomorphicEncryptionBackend.Encryption.Computer import Computer


class ComputerTests(unittest.TestCase):
    """
    Tests for Computer
    """

    def setUp(self):
        """
        Set up the instance before each test
        :return:
        """
        log_manager = mock.Mock()
        self.computer = Computer(log_manager)

    def test_1_plus_1(self):
        """
        Computer.compute - it should perform 1 + 1
        :return:
        """
        self.assertEqual(
            self.computer.compute("1 + 1", {}),
            2
        )

    def test_1_minus_1(self):
        """
        Computer.compute - it should perform 1 - 1
        :return:
        """
        self.assertEqual(
            self.computer.compute("1 - 1", {}),
            0
        )

    def test_4_times_3(self):
        """
        Computer.compute - it should perform 4 * 3
        :return:
        """
        self.assertEqual(
            self.computer.compute("4 * 3", {}),
            12
        )

    def test_6_divide_3(self):
        """
        Computer.compute - it should perform 6 / 3
        :return:
        """
        self.assertEqual(
            self.computer.compute("6 / 3", {}),
            2
        )

    def test_brackets_pair(self):
        """
        Computer.compute - it should perform (1 + 1) * (3 + 2)
        :return:
        """
        self.assertEqual(
            self.computer.compute("(1 + 1) * (3 + 2)", {}),
            10
        )

    def test_brackets_pair_embedded(self):
        """
        Computer.compute - it should perform (1 + (5 * 2)) + (3 + 2)
        :return:
        """
        self.assertEqual(
            self.computer.compute("(1 + (5 * 2)) + (3 + 2)", {}),
            16
        )

    def test_brackets_double_embedded(self):
        """
        Computer.compute - it should perform ((1 + 3) + (5 * 2)) + (3 + 2)
        :return:
        """
        self.assertEqual(
            self.computer.compute("((1 + 3) + (5 * 2)) + (3 + 2)", {}),
            19
        )

    def test_use_of_scope(self):
        """
        Computer.compute - it should perform p * q
        :return:
        """
        self.assertEqual(
            self.computer.compute("p * q", {
                'p': 4,
                'q': 5
            }),
            20
        )

    def test_modulo(self):
        """
        Computer.compute - it should perform 13 % 4
        :return:
        """
        self.assertEqual(
            self.computer.compute("13 % 4", {}),
            1
        )

    def test_power_modulo(self):
        """
        Computer.compute - it should perform 13 & 4,3
        :return:
        """
        self.assertEqual(
            self.computer.compute("13 & 4,3", {}),
            1
        )

    def test_modulo_inverse(self):
        """
        Computer.compute - it should perform 13 $ 4
        :return:
        """
        self.assertEqual(
            self.computer.compute("13 $ 4", {}),
            1
        )

        with self.assertRaises(Exception):
            self.computer.compute("4 $ 6", {})

    def test_mixed_scope(self):
        """
        Computer.compute - it should perform (p - 1) * (q - 1)
        :return:
        """
        self.assertEqual(
            self.computer.compute("(p - 1) * (q - 1)", {
                'p': 5,
                'q': 4
            }),
            12
        )

    def test_broken_expression(self):
        """
        Computer.compute - it should throw an exception is the expression is broken
        :return:
        """
        with self.assertRaises(Exception):
            self.computer.compute("((4 + 5)", {})
