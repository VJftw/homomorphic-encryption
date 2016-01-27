"""
HomomorphicEncryptionBackend.Resolver.KeyResolver
"""

from HomomorphicEncryptionBackend.Encryption import PaillerEncryption
from HomomorphicEncryptionBackend.Encryption import ElGamalECC

__author__ = "VJ Patel (vj@vjpatel.me)"


class KeyResolver:
    """
    KeyResolver
    """

    def from_computation_and_dict(self, computation, c_dict):
        """

        :param computation:
        :param c_dict:
        :return:
        """
        if computation.get_scheme() == "Pailler":
            public_key = self.pailler_public_from_dict(c_dict['publicKey'])
        elif computation.get_scheme() == "ElGamal_ECC":
            public_key = self.elgamal_ecc_from_dict(c_dict['publicKey'])
        else:
            raise Exception("Invalid Encryption Scheme")
        computation.set_public_key(public_key)

    def pailler_public_from_dict(self, public_key_dict):
        p_k = PaillerEncryption.PublicKey(
            int(public_key_dict['n']),
            int(public_key_dict['nSq']),
            int(public_key_dict['g'])
        )

        return p_k

    def elgamal_ecc_from_dict(self, public_key_dict):
        p_k = ElGamalECC.PublicKey(
            int(public_key_dict['p']),
            int(public_key_dict['g']),
            int(public_key_dict['h'])
        )

        return p_k
