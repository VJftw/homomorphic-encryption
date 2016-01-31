import {Injectable} from "angular2/core";

import {EncryptionScheme} from "../../model/encryption_scheme/encryption_scheme";
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
  public fromJson(schemeJson): EncryptionScheme {

    let scheme = new EncryptionScheme(
      schemeJson["unique_name"],
      schemeJson["readable_name"],
      schemeJson["description"],
      schemeJson["capabilities"]
    );

    schemeJson["stages"].forEach(stageJson => {
      let stage = this.encryptionSchemeStageResolver.fromJson(stageJson);
      scheme.addStage(stage);
    });

    return scheme;
  }

}
