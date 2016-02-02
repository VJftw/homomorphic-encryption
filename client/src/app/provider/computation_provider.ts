import {Injectable} from "angular2/core";

import {Computation} from "../model/computation";
import {EncryptionScheme} from "../model/encryption_scheme/encryption_scheme";


@Injectable()
export class ComputationProvider {

  /**
   * creates a Computation
   * @param scheme
   * @returns {Computation}
   */
  public create(scheme: EncryptionScheme): Computation {
    let c = new Computation();

    c
      .setEncryptionScheme(scheme)
      .setOperation(scheme.getCapabilities()[0])
    ;

    return c;
  }

}
