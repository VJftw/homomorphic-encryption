import {Step} from "./step";


export class Stage {

  public static HOST_CLIENT = 0;
  public static HOST_SERVER = 1;


  private name: string;
  private host: number;

  private steps: Array<Step>;

  constructor() {
    this.steps = [];
  }

  /**
   * Returns the name
   * @returns {string}
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Sets the name
   * @param name
   * @returns {Stage}
   */
  public setName(name: string): Stage {
    this.name = name;

    return this;
  }

  /**
   * Returns the host
   * @returns {number}
   */
  public getHost(): number {
    return this.host;
  }

  /**
   * Returns whether or not the Stage is executed on the client
   * @returns {boolean}
   */
  public isClient(): boolean {
    return this.host === Stage.HOST_CLIENT;
  }

  /**
   * Returns whether or not the Stage is executed on the server
   * @returns {boolean}
   */
  public isServer(): boolean {
    return this.host === Stage.HOST_SERVER;
  }

  /**
   * Sets the host
   * @param host
   * @returns {Stage}
   */
  public setHost(host: number) {
    this.host = host;

    return this;
  }

  /**
   * Returns the Steps
   * @returns {Array<Step>}
   */
  public getSteps(): Array<Step> {
    return this.steps;
  }

  /**
   * Adds a Step
   * @param step
   * @returns {Stage}
   */
  public addStep(step: Step): Stage {
    this.steps.push(step);

    return this;
  }

}
