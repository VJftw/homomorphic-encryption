import {EncryptionSchemeStage} from "../../model/encryption_scheme/encryption_scheme_stage";
import {EncryptionSchemeStepResolver} from "./encryption_scheme_step_resolver";


export class EncryptionSchemeStageResolver {

  /**
   * @param encryptionSchemeStepResolver
   */
  constructor(
    private encryptionSchemeStepResolver: EncryptionSchemeStepResolver
  ) {
  }

  /**
   * @param stageJson
   * @returns {EncryptionSchemeStage}
   */
  public fromJson(stageJson): EncryptionSchemeStage {

    let stage = new EncryptionSchemeStage(
      stageJson.name
    );

    stageJson.steps.forEach(stepJson => {
      let step = this.encryptionSchemeStepResolver.fromJson(stepJson);
      stage.addStep(step);
    });

    return stage;
  }

}
