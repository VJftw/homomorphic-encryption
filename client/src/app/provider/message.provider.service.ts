import {Injectable} from 'angular2/core';
import {Computation} from '../model/computation';
import {RegisterMessage} from '../message/register-message';
import {ComputeMessage} from '../message/compute-message';


@Injectable()
export class MessageProviderService {

  public createRegisterMessage(computation: Computation): RegisterMessage {
    return new RegisterMessage(
      computation.getEncryptionScheme()
    );
  }

  public createComputeMessage(computation: Computation): ComputeMessage {

    let publicScope = {};

    for (let varName in computation.getPublicScope()) {
      if (computation.getPublicScope().hasOwnProperty(varName)) {
        publicScope[varName] = computation.getPublicScope()[varName].toString();
      }
    }

    return new ComputeMessage(
      computation.getHashId(),
      computation.getEncryptionScheme().getBackendStageByOperation(
        computation.getOperation()
      ).getSteps(),
      publicScope
    );
  }

}
