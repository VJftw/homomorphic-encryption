import {EncryptionSchemeStep} from "./encryption_scheme_step";


export class EncryptionSchemeStage {

  private name: string;
  private operation: string;
  private steps: EncryptionSchemeStep[];

  constructor(
    name: string
  ) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setOperation(operation: string): EncryptionSchemeStage {
    this.operation = operation;

    return this;
  }

  public getOperation(): string {
    return this.operation;
  }

  public isBackend(): boolean {
    return this.operation !== undefined;
  }

  public addStep(step: EncryptionSchemeStep) {
    this.steps.push(step);

    return this;
  }

  public getSteps(): EncryptionSchemeStep[] {
    return this.steps;
  }

}
