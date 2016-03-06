import {Injectable} from 'angular2/core';
import {Stage} from "../../model/encryption-scheme/stage";
import {IStageJson} from "../../model/encryption-scheme/stage";
import {StepResolverService} from "./step.resolver.service";


@Injectable()
export class StageResolverService {

  constructor(
    private _stepResolverService: StepResolverService
  ) {}

  public fromJson(stageJson: IStageJson, serverSide = false): Stage {

    let stage = new Stage(
      stageJson.name
    );

    if (stageJson.preDescription) {
      stage.setPreDescription(stageJson.preDescription);
    }

    if (stageJson.postDescription) {
      stage.setPostDescription(stageJson.postDescription);
    }

    stage.setServerSide(serverSide);

    for (let stepJson of stageJson.steps) {
      let step = this._stepResolverService.fromJson(stepJson);
      stage.addStep(step);
    }

    return stage;
  }
}
