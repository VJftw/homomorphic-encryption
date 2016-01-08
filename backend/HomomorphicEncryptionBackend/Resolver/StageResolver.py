"""
HomomorphicEncryptionBackend.Resolver.StageResolver
"""

from injector import inject
from HomomorphicEncryptionBackend.Resolver.StepResolver import StepResolver
from HomomorphicEncryptionBackend.Model.Stage import Stage

__author__ = "VJ Patel (vj@vjpatel.me)"


class StageResolver:
    """
    StageResolver
    """

    @inject(step_resolver=StepResolver)
    def __init__(self, step_resolver):
        """
        :return:
        """
        self.__step_resolver = step_resolver

    def from_dict(self, stage_dict):
        stage = Stage()

        stage.set_name(stage_dict['name'])

        for step_dict in stage_dict['steps']:
            stage.add_step(
                self.__step_resolver.from_dict(step_dict)
            )

        return stage
