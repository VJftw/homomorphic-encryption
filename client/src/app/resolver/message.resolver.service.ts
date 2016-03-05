import {Injectable} from 'angular2/core';

import {BigInteger} from 'jsbn';
import {Computation} from '../model/computation';
import {IRegisterMessageResponseJson} from '../message/register-message';
import {IComputeMessageResponseJson} from '../message/compute-message';
import {StepProviderService} from "../provider/step.provider.service";


@Injectable()
export class MessageResolverService {

  constructor(
    private stepProvider: StepProviderService
  ) {
  }

  public resolveRegisterMessage(message: IRegisterMessageResponseJson, computation: Computation): Computation {
    computation.setHashId(message.hashId);

    return computation;
  }

  public resolveComputeMessage(message: IComputeMessageResponseJson, computation: Computation): Computation {

    // Resolve scope
    let publicScope = message.publicScope;
    for (let varName in publicScope) {
      if (publicScope.hasOwnProperty(varName)) {
        computation.addToScope(varName, new BigInteger(publicScope[varName]), true);
      }
    }

    // Resolve Backend stage.
    let backendStage = computation.getEncryptionScheme().getBackendStageByOperation(computation.getOperation());
    let backendSteps = backendStage.getSteps();

    let results = message.results.slice(backendStage.getSteps().length - message.results.length);
    for (let i = 0; i < backendSteps.length; i++) {
      let schemeStep = backendSteps[i];
      let step = this.stepProvider.create(schemeStep.getDescription(), new BigInteger(results[i]));

      computation.getStageByName(backendStage.getName()).addStep(step);
    }

    // resolve State
    if (message.computeSteps.length === 0) {
      computation.setState(Computation.STATE_COMPLETE);
    }

    return computation;
  }
}
