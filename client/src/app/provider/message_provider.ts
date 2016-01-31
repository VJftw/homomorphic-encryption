import {Injectable} from "angular2/core";

import {RegisterMessage} from "../message/register_message";
import {Computation} from "../model/computation";
import {ComputeMessage} from "../message/compute_message";
import {EncryptionSchemeStage} from "../model/encryption_scheme/encryption_scheme_stage";


@Injectable()
export class MessageProvider {

  public createRegisterMessage(computation: Computation): RegisterMessage {
    return new RegisterMessage(
      computation.getEncryptionScheme()
    );
  }

  public createComputeMessage(computation: Computation): ComputeMessage {

    return new ComputeMessage(
      computation.getHashId(),
      computation.getEncryptionScheme().getBackendStage().getSteps(),
      computation.getPublicScope()
    );
  }

}
