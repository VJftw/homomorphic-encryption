"""
HomomorphicEncryptionBackend.Model.Step
"""

__author__ = "VJ Patel (vj@vjpatel.me)"


class Step:
    """
    Step
    """

    def __init__(self):
        self.__computation = None
        self.__action = None
        self.__result = None
        self.__timestamp = None

    def set_computation(self, computation):
        """
        Sets the computation
        :param Computation computation:
        :return self:
        """
        self.__computation = computation

        return self

    def get_computation(self):
        """
        Returns the computation
        :return:
        """
        return self.__computation

    def set_action(self, action):
        """
        Sets the action
        :param str action:
        :return: self
        """
        self.__action = action

        return self

    def get_action(self):
        """
        Returns the action
        :return str:
        """
        return self.__action

    def set_result(self, result):
        """
        Sets the result
        :param str result:
        :return self:
        """
        self.__result = result

        return self

    def get_result(self):
        """
        Returns the result
        :return str:
        """
        return self.__result

    def set_timestamp(self, timestamp):
        """
        Sets the timestamp
        :param DateTime timestamp:
        :return self:
        """
        self.__timestamp = timestamp

        return self

    def get_timestamp(self):
        """
        Returns the timestamp
        :return DateTime:
        """
        return self.__timestamp

    def to_json(self):
        """
        Returns a dict to be serialized into JSON
        :return {}:
        """
        return {
            'action': self.__action,
            'result': "{0}".format(self.__result),
            'timestamp': str(self.__timestamp)
        }
