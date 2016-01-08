import {Step} from "../model/step";
import {BigInteger} from "jsbn";

export class StepResolver {

  public fromJson(jsonArr) {
    let step = new Step();

    step
      .setAction(jsonArr.action)
      .setResult(new BigInteger(jsonArr.result))
      .setTimestamp(new Date(jsonArr.timestamp))
    ;

    return step;
  }
}
