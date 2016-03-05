import {BigInteger} from 'jsbn';


export class Step {

  public action: string;
  protected result: BigInteger;
  protected timestamp: Date;

  /**
   * Returns the action
   * @returns {string}
   */
  public getAction(): string {
    return this.action;
  }

  /**
   * Sets the action
   * @param instruction
   * @returns {Step}
   */
  public setAction(instruction: string): Step {
    this.action = instruction;

    return this;
  }

  /**
   * Sets the result
   * @param result
   * @returns {Step}
   */
  public setResult(result: BigInteger): Step {
    this.result = result;

    return this;
  }

  /**
   * Returns the result
   * @returns {BigInteger}
   */
  public getResult(): BigInteger {
    return this.result;
  }

  /**
   * Returns the timestamp
   * @returns {Date}
   */
  public getTimestamp(): Date {
    return this.timestamp;
  }

  /**
   * Sets the timestamp
   * @param timestamp
   * @returns {Step}
   */
  public setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;

    return this;
  }
}
