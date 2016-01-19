import {BigInteger} from "jsbn";

export class Step {

  public action: string;
  protected result: BigInteger;
  protected timestamp: Date;

  public getAction(): string {
    return this.action;
  }

  public setAction(instruction: string): Step {
    this.action = instruction;

    return this;
  }

  public setResult(result: BigInteger): Step {
    this.result = result;

    return this;
  }

  public getResult(): BigInteger {
    return this.result;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;

    return this;
  }

  public toJson() {
    return {
      "action": this.action,
      "result": (this.result ? this.result.toString() : null),
      "timestamp": this.timestamp.toString()
    };
  }
}
