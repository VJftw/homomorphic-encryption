import {Injectable} from "angular2/core";
import {Computation} from "../model/computation";
import {BigInteger} from "jsbn";
import {StageResolver} from "./stage_resolver";

@Injectable()
export class ComputationResolver {

  constructor(
    private stageResolver: StageResolver
  ) {
  }

  public fromJson(jsonArr, computation?: Computation): Computation {
    if (!computation) {
      computation = new Computation();
    }
    computation
      .setScheme(jsonArr.scheme)
      .setOperation(jsonArr.operation)
      .setAEncrypted(new BigInteger(jsonArr.aEncrypted))
      .setBEncrypted(new BigInteger(jsonArr.bEncrypted))
      .setState(jsonArr.state)
    ;

    jsonArr.stages.slice(computation.getStages().length).forEach(stageJson => {
      let stage = this.stageResolver.fromJson(stageJson);
      computation.addStage(stage);
    });

    return computation;
  }
}
