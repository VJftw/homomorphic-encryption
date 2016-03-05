import {Step} from './step';
import {IStepJson} from './step';


export class Stage {

  private name: string;
  private operation: string;
  private steps: Step[];

  constructor(
    name: string
  ) {
    this.name = name;
    this.steps = [];
  }

  public getName(): string {
    return this.name;
  }

  public setOperation(operation: string): Stage {
    this.operation = operation;

    return this;
  }

  public getOperation(): string {
    return this.operation;
  }

  public isBackend(): boolean {
    return this.operation !== undefined;
  }

  public addStep(step: Step) {
    this.steps.push(step);

    return this;
  }

  public getSteps(): Step[] {
    return this.steps;
  }

  public toJson() {
    let steps = [];

    this.steps.forEach(step => {
      steps.push(step.toJson());
    });

    return {
      'name': this.getName(),
      'steps': steps
    };
  }

}

export interface IStageJson {
  name: string;
  operation?: string;
  steps: IStepJson[];
}
