"""
HomomorphicEncryptionBackend.Encryption.Computer
"""

from injector import inject
from HomomorphicEncryptionBackend.Manager.LogManager import LogManager

__author__ = "VJ Patel (vj@vjpatel.me)"


class Computer:
    """
    Computer
    """

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
        """
        :param LogManager log_manager:
        :return:
        """
        self.__logger = log_manager.get_logger("Computer")

    def compute(self,
                compute,
                scope):
        self.__logger.debug(compute)
        self.__logger.debug(scope)
        return self.__do_command(compute, scope)

    def __do_command(self, command, scope):
        return self.__calc_expression(command, scope)

    def __trim_brackets(self, expr):
        if expr[0] == "(" and expr[-1] == ")":
            return expr[1:-1]
        else:
            return expr

    def __calc_expression(self, expr, scope):
        top_op_loc = self.__find_top_operator_location(expr)
        top_op = expr[top_op_loc]

        self.__logger.debug("Top operator: {0} at: {1}".format(top_op, top_op_loc))

        a_str = self.__trim_brackets(expr[0:top_op_loc].strip())
        b_str = self.__trim_brackets(expr[top_op_loc + 1:].strip())

        self.__logger.debug("\taStr: {0}".format(a_str))
        self.__logger.debug("\tbStr: {0}".format(b_str))

        c = None
        if top_op == "&":
            parts = b_str.split(",")
            b_str = parts[0]
            c_str = parts[1]
            self.__logger("\tbStr: {0}".format(b_str))
            self.__logger("\tcStr: {0}".format(c_str))

            # resolve c
            c = self.__resolve_variable(c_str, scope)

        # check if a requires more operations
        if any(operator in a_str for operator in Computer.OPERATIONS):
            a = self.__calc_expression(a_str, scope)
        else:
            a = self.__resolve_variable(a_str, scope)

        # check if c requires more operations
        if any(operator in b_str for operator in Computer.OPERATIONS):
            b = self.__calc_expression(b_str, scope)
        else:
            b = self.__resolve_variable(b_str, scope)

        self.__logger.debug("\t\ta: {0}".format(a))
        self.__logger.debug("\t\tb: {0}".format(b))

        if top_op == "&" and c is not None:
            self.__logger.debug("\t\tc: {0}".format(c))
            self.__logger.debug(scope)

            return self.__calc(a, top_op, b, c)

        return self.__calc(a, top_op, b)

    def __calc(self, a, operator, b, c=None):
        if operator == "+":
            return a + b
        if operator == "-":
            return a - b
        if operator == "*":
            return a * b
        if operator == "/":
            return a // b
        if operator == "%":
            return a % b
        if operator == "$":
            return self.__modinv(a, b)
        if operator == "&":
            return pow(a, b, c)

    def __egcd(self, a, b):
        if a == 0:
            return b, 0, 1
        else:
            g, y, x = self.__egcd(b % a, a)
            return g, x - (b // a) * y, y

    def __modinv(self, a, m):
        g, x, y = self.__egcd(a, m)
        if g != 1:
            raise Exception('modular inverse does not exist')
        else:
            return x % m

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

    def __resolve_variable(self, v, scope):
        if v in scope:
            return int(scope[v])
        elif self.__is_int(v):
            return int(v)
        else:
            raise Exception("Cannot resolve variable: {0}".format(v))

    def __is_int(self, string):
        try:
            int(string)
            return True
        except ValueError:
            return False
