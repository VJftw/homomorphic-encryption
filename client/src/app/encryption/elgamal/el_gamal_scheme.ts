import {Injectable} from "angular2/core";
import {EncryptionScheme, Operation} from "../encryption_scheme";
import {Computation} from "../../model/computation";
import {ComputationResolver} from "../../resolver/computation_resolver";
import {StageProvider} from "../../provider/stage_provider";
import {Http} from "angular2/http";
import {StepProvider} from "../../provider/step_provider";


@Injectable()
export class ElGamalScheme extends EncryptionScheme {

  protected socket: WebSocket;

  protected computation: Computation;

  constructor(
    private stageProvider: StageProvider,
    private stepProvider: StepProvider,
    private computationResolver: ComputationResolver,
    private http: Http
  ) {
  }

  getName(): string {
    return "ElGamal_ECC";
  }

  getDescription(): string {
    return "";
  }

  getCapabilities(): Array<string> {
    return [Operation.ADD];
  }

  doScheme():void {
    this.workspace();
  }

  private workspace(): void {
    let stageName = "Workspace";
    this.computation.addStage(
      this.stageProvider.create(stageName)
    );
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "We aim to calculate \\(a + b = c\\)"
    ));
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(a\\)",
      this.computation.getA()
    ));
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(b\\)",
      this.computation.getB()
    ));
  }

  private generateKeys(): void {

  }

}
