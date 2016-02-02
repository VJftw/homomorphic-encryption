import {Injectable} from "angular2/core";

import {EncryptionScheme, IEncryptionSchemeJson} from "../../model/encryption_scheme/encryption_scheme";
import {EncryptionSchemeStageResolver} from "./encryption_scheme_stage_resolver";


@Injectable()
export class EncryptionSchemeResolver {

  /**
   * @param encryptionSchemeStageResolver
   */
  constructor(
    private encryptionSchemeStageResolver: EncryptionSchemeStageResolver
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

    for (let stageJson of schemeJson.stages) {
      let stage = this.encryptionSchemeStageResolver.fromJson(stageJson);
      scheme.addStage(stage);
    }

    return scheme;
  }

}
