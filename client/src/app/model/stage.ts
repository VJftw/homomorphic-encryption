import {Step} from "./step";

/**
 * Stage
 */
export class Stage {

  private name: string;

  private steps: Array<Step>;

  constructor() {
    this.steps = [];
  }

  /**
   * getName
   * @returns {string}
   */
  public getName(): string {
    return this.name;
  }

  /**
   * setName
   * @param name
   * @returns {Stage}
   */
  public setName(name: string): Stage {
    this.name = name;

    return this;
  }

  /**
   * getSteps
   * @returns {Array<Step>}
   */
  public getSteps(): Array<Step> {
    return this.steps;
  }

  /**
   * addStep
   * @param step
   * @returns {Stage}
   */
  public addStep(step: Step): Stage {
    this.steps.push(step);

    return this;
  }

  public toJson() {
    let steps = [];
    this.steps.forEach(function(step) {
      steps.push(step.toJson());
    });
    return {
      "name": this.name,
      "steps": steps
    };
  }
}
