import {EncryptionSchemeStep} from "./encryption_scheme_step";


export class EncryptionSchemeStage {

  private name: string;
  private steps: EncryptionSchemeStep[];

  constructor(
    name: string
  ) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public addStep(step: EncryptionSchemeStep) {
    this.steps.push(step);

    return this;
  }

  public getSteps(): EncryptionSchemeStep[] {
    return this.steps;
  }

}
