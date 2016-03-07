import {BigInteger} from 'jsbn';

import * as EncryptionStep from '../encryption-scheme/step';

export class Step {

  private _encryptionStep: EncryptionStep.Step;

  private _variable: string;
  private _calculation: string;
  private _result: BigInteger;

  public getEncryptionStep() {
    return this._encryptionStep;
  }

  public setEncryptionStep(encryptionStep: EncryptionStep.Step) {
    this._encryptionStep = encryptionStep;

    return this;
  }

  public getVariable() {
    return this._variable;
  }

  public setVariable(v: string) {
    this._variable = v;

    return this;
  }

  public getCalculation() {
    return this._calculation;
  }

  public setCalculation(c: string) {
    this._calculation = c;

    return this;
  }

  public getResult() {
    return this._result;
  }

  public setResult(r: BigInteger) {
    this._result = r;

    return this;
  }

}
