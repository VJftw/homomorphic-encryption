import {EncryptionSchemeStep} from "./encryption_scheme_step";


export class EncryptionSchemeStage {

  private name: string;
  private backend: boolean;
  private steps: EncryptionSchemeStep[];

  constructor(
    name: string,
    backend = false
  ) {
    this.name = name;
    this.backend = false;
  }

  public getName(): string {
    return this.name;
  }

  public isBackend(): boolean {
    return this.backend;
  }

  public addStep(step: EncryptionSchemeStep) {
    this.steps.push(step);

    return this;
  }

  public getSteps(): EncryptionSchemeStep[] {
    return this.steps;
  }

}
