"""
HomomorphicEncryptionBackend.Model.Stage
"""

__author__ = "VJ Patel (vj@vjpatel.me)"


class Stage:
    """
    Stage
    """

    TYPE_CLIENT = 0
    TYPE_SERVER = 1

    def __init__(self):
        self.__name = None
        self.__host = None
        self.steps = []

    def set_name(self, name):
        """
        Sets the name
        :param str name:
        :return self:
        """
        self.__name = name

        return self

    def get_name(self):
        """
        Returns the name
        :return:
        """
        return self.__name

    def set_host(self, host):
        """
        Sets the host
        :param int type:
        :return self:
        """
        self.__host = host

        return self

    def get_host(self):
        """
        Returns the host
        :return int:
        """
        return self.__host

    def add_step(self, step):
        """
        Adds a Step
        :param Step step:
        :return self:
        """
        self.steps.append(step)

        return self

    def get_steps(self):
        """
        Returns the steps
        :return Step[]:
        """
        return self.steps

    def to_json(self):
        """
        Returns a dict to be serialized into JSON
        :return {}:
        """
        return {
            'name': self.get_name(),
            'host': self.get_host(),
            'steps': self.get_steps()
        }
