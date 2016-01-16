"""
HomomorphicEncryptionBackend.Model.Computation
"""

__author__ = "VJ Patel (vj@vjpatel.me)"


class Computation:
    """
    Computation
    """

    STATE_NEW = 0
    STATE_STARTED = 1
    STATE_COMPLETE = 2

    def __init__(self):
        self.__hash_id = None
        self.__scheme = None
        self.__operator = None

        self.__a_encrypted = None
        self.__b_encrypted = None

        self.__public_key = None

        self.__timestamp = None
        self.__state = None
        self.__stages = []

    def set_hash_id(self, hash_id):
        """
        Sets the HashId
        :param str hash_id:
        :return self:
        """
        self.__hash_id = hash_id

        return self

    def get_hash_id(self):
        """
        Returns the HashId
        :return str:
        """
        return self.__hash_id

    def set_scheme(self, scheme):
        """
        Sets the encryption scheme
        :param str scheme:
        :return self:
        """
        self.__scheme = scheme

        return self

    def get_scheme(self):
        """
        Returns the scheme
        :return str:
        """
        return self.__scheme

    def get_operator(self):
        """
        Returns the operator
        :return str:
        """
        return self.__operator

    def set_operator(self, operator):
        """
        Sets the operator
        :param str operator:
        :return self:
        """
        self.__operator = operator

        return self

    def set_a_encrypted(self, x_encrypted):
        """
        Sets the encrypted value of x
        :param int x_encrypted:
        :return self:
        """
        self.__a_encrypted = x_encrypted

        return self

    def get_a_encrypted(self):
        """
        Returns the encrypted value of x
        :return int:
        """
        return self.__a_encrypted

    def set_b_encrypted(self, y_encrypted):
        """
        Sets the encrypted value of y
        :param int y_encrypted:
        :return self:
        """
        self.__b_encrypted = y_encrypted

        return self

    def get_b_encrypted(self):
        """
        Returns the encrypted value of y
        :return int:
        """
        return self.__b_encrypted

    def set_public_key(self, public_key):
        """
        Sets the Public key
        :param PublicKey public_key:
        :return self:
        """
        self.__public_key = public_key

        return self

    def get_public_key(self):
        """
        Returns the Public key
        :return int:
        """
        return self.__public_key

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

    def set_state(self, state):
        """
        Sets the State
        :param int state:
        :return self:
        """
        self.__state = state

        return self

    def get_state(self):
        """
        Returns the state
        :return int:
        """
        return self.__state

    def add_stage(self, stage):
        """
        Adds a Stage
        :param Stage stage:
        :return self:
        """
        self.__stages.append(stage)

        return self

    def get_stages(self):
        """
        Returns the Stages
        :return []:
        """
        return self.__stages

    def to_json(self):
        """
        Returns a dict to be serialized into JSON
        :return {}:
        """
        return {
            'hashId': self.get_hash_id(),
            'scheme': self.get_scheme(),
            'aEncrypted': "{0}".format(self.get_a_encrypted()),
            'bEncrypted': "{0}".format(self.get_b_encrypted()),
            'publicKey': self.get_public_key(),
            'stages': self.get_stages(),
            'timestamp': str(self.get_timestamp()),
            'state': self.get_state()
        }
