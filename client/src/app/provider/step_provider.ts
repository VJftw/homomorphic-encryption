import {Injectable} from "angular2/core";
import {BigInteger} from "jsbn";
import {Step} from "../model/step";

@Injectable()
export class StepProvider {

  public create(action?: string, result?: BigInteger): Step {
    let step = new Step();

    step
      .setAction(action)
      .setResult(result)
      .setTimestamp(new Date())
    ;

    return step;
  }
}
