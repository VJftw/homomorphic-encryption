"""
HomomorphicEncryptionBackend.Model.Computation
"""

__author__ = "VJ Patel (vj@vjpatel.me)"


class Computation:
    """
    Computation
    """

    def __init__(self):
        self.__hash_id = None
        self.__compute_steps = []
        self.__public_scope = {}
        self.__results = []

    def get_hash_id(self):
        return self.__hash_id

    def set_hash_id(self, hash_id):
        self.__hash_id = hash_id

        return self

    def get_compute_steps(self):
        return self.__compute_steps

    def set_compute_steps(self, compute_steps):
        self.__compute_steps = compute_steps

        return self

    def remove_compute_step(self, step):
        self.__compute_steps.remove(step)
        
        return self

    def get_public_scope(self):
        return self.__public_scope

    def set_public_scope(self, public_scope):
        self.__public_scope = public_scope

        return self

    def add_public_scope(self, var_name, value):
        self.__public_scope[var_name] = value

        return self

    def get_results(self):
        return self.__results

    def add_result(self, result):
        self.__results.append(result)

        return self

    def to_json(self):
        """
        Returns a dict representation suitable for serializing to JSON
        :return:
        """
        return {
            "hashId": self.get_hash_id(),
            "computeSteps": self.get_compute_steps(),
            "publicScope": self.get_public_scope(),
            "results": self.get_results()
        }
