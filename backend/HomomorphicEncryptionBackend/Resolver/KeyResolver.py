"""
HomomorphicEncryptionBackend.Resolver.KeyResolver
"""

from HomomorphicEncryptionBackend.Model.PublicKey import PublicKey

__author__ = "VJ Patel (vj@vjpatel.me)"


class KeyResolver:
    """
    KeyResolver
    """

    def __init__(self):
        """
        :return:
        """
        pass

    def public_from_dict(self, public_key_dict):
        p_k = PublicKey(
            int(public_key_dict['n']),
            int(public_key_dict['nSq']),
            int(public_key_dict['g'])
        )

        return p_k
