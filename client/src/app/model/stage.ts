import {Step} from "./step";

/**
 * Stage
 */
export class Stage {

  public static TYPE_CLIENT = 0;
  public static TYPE_SERVER = 1;


  private name: string;
  private type: number;

  private steps: Array<Step>;

  constructor() {
    this.steps = [];
    this.type = Stage.TYPE_CLIENT;
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
   * getType
   * @returns {number}
   */
  public getType(): number {
    return this.type;
  }

  /**
   * setType
   * @param type
   * @returns {Stage}
   */
  public setType(type: number) {
    this.type = type;

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
      "name": this.getName(),
      "type": this.getType(),
      "steps": steps
    };
  }
}
