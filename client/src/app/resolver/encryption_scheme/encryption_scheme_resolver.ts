import {Injectable} from "angular2/core";

import {EncryptionScheme, IEncryptionSchemeJson} from "../../model/encryption_scheme/encryption_scheme";
import {EncryptionSchemeStageResolver} from "./encryption_scheme_stage_resolver";
import {EncryptionSchemeBitLengthResolver} from "./encryption_scheme_bit_length_resolver";


@Injectable()
export class EncryptionSchemeResolver {

  /**
   * @param encryptionSchemeStageResolver
   * @param encryptionSchemeBitLengthResolver
   */
  constructor(
    private encryptionSchemeStageResolver: EncryptionSchemeStageResolver,
    private encryptionSchemeBitLengthResolver: EncryptionSchemeBitLengthResolver
  ) {
  }

  /**
   * @param schemeJson
   * @returns {EncryptionScheme}
   */
  public fromJson(schemeJson: IEncryptionSchemeJson): EncryptionScheme {

    let scheme = new EncryptionScheme(
      schemeJson.uniqueName,
      schemeJson.readableName,
      schemeJson.description,
      schemeJson.capabilities
    );

    for (let bitLengthJson of schemeJson.bitLengths) {
      let bitLength = this.encryptionSchemeBitLengthResolver.fromJson(bitLengthJson);
      scheme.addBitLength(bitLength);
    }

    for (let stageJson of schemeJson.stages) {
      let stage = this.encryptionSchemeStageResolver.fromJson(stageJson);
      scheme.addStage(stage);
    }

    return scheme;
  }

}
