"""
HomomorphicEncryptionBackend.Resolver.StepResolver
"""

from HomomorphicEncryptionBackend.Model.Step import Step

__author__ = "VJ Patel (vj@vjpatel.me)"


class StepResolver:
    """
    StepResolver
    """

    def __init__(self):
        """
        :return:
        """
        pass

    def from_dict(self, step_dict):
        step = Step()

        step.set_action(step_dict['action'])
        step.set_timestamp(step_dict['timestamp'])

        if 'result' in step_dict:
            step.set_result(step_dict['result'])

        return step
