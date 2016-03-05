import {EncryptionSchemeStage, IEncryptionSchemeStageJson} from '../../model/encryption_scheme/encryption_scheme_stage';
import {EncryptionSchemeStepResolver} from './encryption_scheme_step_resolver';
import {Injectable} from 'angular2/core';

@Injectable()
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
  public fromJson(stageJson: IEncryptionSchemeStageJson): EncryptionSchemeStage {

    let stage = new EncryptionSchemeStage(
      stageJson.name
    );

    if (stageJson.operation) {
      stage.setOperation(stageJson.operation);
    }

    for (let stepJson of stageJson.steps) {
      let step = this.encryptionSchemeStepResolver.fromJson(stepJson);
      stage.addStep(step);
    }

    return stage;
  }

}
