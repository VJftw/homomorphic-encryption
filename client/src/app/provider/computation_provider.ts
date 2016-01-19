import {Injectable} from "angular2/core";
import {Computation} from "../model/computation";
import {EncryptionScheme} from "../encryption/encryption_scheme";


@Injectable()
export class ComputationProvider {

  public create(scheme: EncryptionScheme): Computation {
    let c = new Computation();

    c
      .setScheme(scheme.getName())
      .setOperation(scheme.getCapabilities()[0])
    ;

    return c;
  }

}
