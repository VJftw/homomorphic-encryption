import {Injectable} from 'angular2/core';
import {Step} from "../../model/encryption-scheme/step";
import {IStepJson} from "../../model/encryption-scheme/step";


@Injectable()
export class StepResolverService {

  public fromJson(stepJson: IStepJson): Step {
    return new Step(
      stepJson.description,
      stepJson.compute,
      !!stepJson.isPublic
    );
  }

}