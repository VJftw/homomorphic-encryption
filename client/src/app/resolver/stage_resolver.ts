import {Injectable} from "angular2/core";
import {Stage} from "../model/stage";
import {StepResolver} from "./step_resolver";

@Injectable()
export class StageResolver {

  private stepResolver: StepResolver;

  constructor(
    stepResolver: StepResolver
  ) {
    this.stepResolver = stepResolver;
  }

  public fromJson(jsonArr, stage?: Stage): Stage {
    if (!stage) {
      stage = new Stage();
    }
    stage
      .setName(jsonArr.name)
      .setHost(jsonArr.host)
    ;

    jsonArr.steps.forEach(stepJson => {
      let step = this.stepResolver.fromJson(stepJson);
      stage.addStep(step);
    });

    return stage;
  }
}
