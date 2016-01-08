"""
HomomorphicEncryptionBackend.Model.PublicKey
"""

__author__ = "VJ Patel (vj@vjpatel.me)"


class PublicKey:
    """
    PublicKey
    """

    def __init__(self, n, n_sq, g):
        self.__n = n
        self.__n_sq = n_sq
        self.__g = g

    def get_n(self):
        return self.__n

    def get_n_sq(self):
        return self.__n_sq

    def get_g(self):
        return self.__g

    def to_json(self):
        return {
            'n': "{0}".format(self.get_n()),
            'nSq': "{0}".format(self.get_n_sq()),
            'g': "{0}".format(self.get_g())
        }
