import {Injectable} from 'angular2/core';

import {BigInteger} from 'jsbn';
import {Computation} from '../model/computation';
import {IRegisterMessageResponseJson} from '../message/register-message';
import {IComputeMessageResponseJson} from '../message/compute-message';
import {StepProviderService} from "../provider/step.provider.service";
import {Stage} from "../model/computation/stage";


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
    let backendStage = computation.getStagesByPhase(Stage.PHASE_BACKEND)[0];
    let backendSteps = backendStage.getSteps();

    let results = message.results.slice(backendSteps.length - message.results.length);
    for (let i = 0; i < backendSteps.length; i++) {
      let step = backendSteps[i];
      let result = new BigInteger(results[i]);
      step.setResult(result);
    }

    // resolve State
    if (message.computeSteps.length === 0) {
      computation.setState(Computation.STATE_COMPLETE);
    }

    return computation;
  }
}
