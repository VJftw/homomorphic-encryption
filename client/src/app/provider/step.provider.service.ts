import {Injectable} from 'angular2/core';

import {BigInteger} from 'jsbn';
import {Step} from "../model/computation/step";
import * as EncryptionStep from '../model/encryption-scheme/step';


@Injectable()
export class StepProviderService {

  /**
   *
   * @param encryptionStep
   * @returns {Step}
   */
  public create(encryptionStep: EncryptionStep.Step): Step {
    let step = new Step();

    let varName = encryptionStep.getCompute().split(' = ')[0];
    let calculation = encryptionStep.getCompute().split(' = ')[1];


    step
      .setEncryptionStep(encryptionStep)
      .setVariable(varName)
      .setCalculation(calculation)
    ;

    return step;
  }
}
