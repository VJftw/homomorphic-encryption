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
        return self.__do_command(compute, scope)

    def __do_command(self, command, scope):
        if command == "generateRandomPrime()":
            return self.__encryption_helper.generatePrime(16)
        else:
            return self.__calc_expression(command, scope)

    def __trim_brackets(self, expr):
        if(expr[0] == "(" and expr[-1] == ")"):
            return expr[1:-1]
        else:
            return expr

    def __calc_expression(self, expr, scope):
        top_op_loc = self.__find_top_operator_location(expr)
        top_op = expr[top_op_loc]

        self.__logger.debug("Top operator: {0} at: {1}".format(top_op, top_op_loc))

        aStr = self.__trim_brackets(expr[0:top_op_loc].strip())
        bStr = self.__trim_brackets(expr[top_op_loc + 1:].strip())

        self.__logger.debug("\taStr: {0}".format(aStr))
        self.__logger.debug("\tbStr: {0}".format(bStr))

        if top_op == "&":
            parts = bStr.split(",")
            bStr = parts[0]
            cStr = parts[1]
            self.__logger("\tbStr: {0}".format(bStr))
            self.__logger("\tcStr: {0}".format(cStr))

            # check if c requires more operations
            if any(operator in cStr for operator in Computer.OPERATIONS):
                c = self.__calc_expression(cStr, scope)
            else:
                c = self.__resolve_variable(cStr, scope)

        # check if a requires more operations
        if any(operator in aStr for operator in Computer.OPERATIONS):
            a = self.__calc_expression(aStr, scope)
        else:
            a = self.__resolve_variable(aStr, scope)

        # check if c requires more operations
        if any(operator in bStr for operator in Computer.OPERATIONS):
            b = self.__calc_expression(bStr, scope)
        else:
            b = self.__resolve_variable(bStr, scope)

        self.__logger.debug("\t\ta: {0}".format(a))
        self.__logger.debug("\t\tb: {0}".format(b))

        if top_op == "&":
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
            return modInv(a, b)
        if operator == "&":
            return pow(a, b, c)

    def egcd(a, b):
        if a == 0:
            return (b, 0, 1)
        else:
            g, y, x = egcd(b % a, a)
            return (g, x - (b // a) * y, y)

    def modinv(a, m):
        g, x, y = egcd(a, m)
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
            raise Error("Cannot resolve variable: {0}".format(v))


    def __is_int(self, string):
        try:
            int(string)
            return True
        except ValueError:
            return False
