"""
HomomorphicEncryptionBackend.Encryption.Computer
"""

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager

__author__ = "VJ Patel (vj@vjpatel.me)"


class Computer:

    OPERATIONS = [
        "+",
        "-",
        "/",
        "*",
        "%",
        "&",
        "$"
    ]

    @inject(log_manager=LogManager)
    def __init__(self, log_manager):
        self.__logger = log_manager.get_logger("Computer")
        pass

    def compute(self,
                compute,
                scope):
        self.__logger.debug(compute)
        self.__logger.debug(scope)
        return 12321

    def __do_command(self, command, scope):
        if command == "generateRandomPrime()":
            return self.__encryption_helper.generatePrime(16)
        else:
            return self.__calc_expression(command, scope)

    def __calc_expression(self, expr, scope):
        top_op_loc = self.__find_top_operator_location(expr)
        top_op = expr[top_op_loc]

    def __find_top_operator_location(self, expr):
        bracket_counter = 0
        top_level_loc = -1

        for i in range(0, len(expr)):
            char = expr[i]

            if char == "(":
                bracket_counter += 1
            elif char == ")":
                bracket_counter -= 1
            elif bracket_counter == 0 and char in Computer.OPERATIONS:
                top_level_loc = i

        if bracket_counter != 0 or top_level_loc == -1:
            raise Exception("Broken expression")

        return top_level_loc
