import {Injectable} from "angular2/core";

import {EncryptionSchemeStep} from "../../model/encryption_scheme/encryption_scheme_step";


@Injectable()
export class EncryptionSchemeStepResolver {

  /**
   * @param stepJson
   * @returns {EncryptionSchemeStep}
   */
  public fromJson(stepJson): EncryptionSchemeStep {
    return new EncryptionSchemeStep(
      stepJson.description,
      stepJson.compute
    );
  }

}