import {Injectable} from "angular2/core";

import {Computation} from "../model/computation";
import {StepProvider} from "../provider/step_provider";


@Injectable()
export class MessageResolver {

  constructor(
    private stepProvider: StepProvider
  ) {
  }

  public resolveRegisterMessage(message: {}, computation: Computation): Computation {
    computation.setHashId(message["hashId"]);

    return computation;
  }

  public resolveComputeMessage(message: {}, computation: Computation): Computation {

    // Resolve scope
    let publicScope = message["publicScope"];
    for (let varName in publicScope) {
      if (publicScope.hasOwnProperty(varName)) {
        computation.addToScope(varName, publicScope[varName], true);
      }
    }

    // Resolve Backend stage.
    let backendStage = computation.getEncryptionScheme().getBackendStage();
    let backendSteps = backendStage.getSteps();

    let results = message["results"].slice(backendStage.getSteps().length);
    for (let i = 0; i < backendSteps.length; i++) {
      let schemeStep = backendSteps[i];
      let step = this.stepProvider.create(schemeStep.getDescription(), results[i]);

      computation.getStageByName(backendStage.getName()).addStep(step);
    }

    // resolve State
    if (message["compute"].length === 0) {
      computation.setState(Computation.STATE_COMPLETE);
    }

    return computation;
  }
}
