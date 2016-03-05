import {Injectable} from 'angular2/core';

import {Computation} from "../model/computation";
import {EncryptionScheme} from "../model/encryption-scheme";


@Injectable()
export class ComputationProviderService {

  public create(scheme: EncryptionScheme): Computation {
    let c = new Computation();

    c
      .setEncryptionScheme(scheme)
      .setOperation(scheme.getCapabilities()[0])
      .setBitLength(scheme.getBitLengths()[0].getBitLength())
    ;

    return c;
  }

}
