import {Injectable} from "angular2/core";

import {Computation} from "../model/computation";
import {StageProvider} from "../provider/stage_provider";
import {StepProvider} from "../provider/step_provider";
import {Http} from "angular2/http";
import {Headers} from "angular2/http";
import {Computer} from "../encryption/computer";
import {EncryptionSchemeStep} from "../model/encryption_scheme/encryption_scheme_step";
import {MessageProvider} from "../provider/message_provider";
import {MessageResolver} from "../resolver/message_resolver";
import {EncryptionSchemeStage} from "../model/encryption_scheme/encryption_scheme_stage";
import {BigInteger} from "jsbn";
import {Stage} from "../model/stage";

@Injectable()
export class ComputationRunner {

  private computation: Computation;
  private socket: WebSocket;

  constructor(
    private stageProvider: StageProvider,
    private stepProvider: StepProvider,
    private computer: Computer,
    private messageProvider: MessageProvider,
    private messageResolver: MessageResolver,
    private http: Http
  ) {
  }

  public setComputation(computation: Computation) {
    this.computation = computation;

    return this;
  }

  public getComputation(): Computation {
    return this.computation;
  }

  public runComputation(): void {
    // set up a and b
    this.computation.addToScope("a", new BigInteger("" + this.computation.getA()), false);
    this.computation.addToScope("b", new BigInteger("" + this.computation.getB()), false);

    this.addWorkspace();


    let encryptionScheme = this.computation.getEncryptionScheme();

    let schemeStages = encryptionScheme.getSetupStages();
    schemeStages.forEach(schemeStage => {
      this.doStage(schemeStage);
    });

    this.registerComputation();
  }

  private addWorkspace(): void {
    let stage = this.stageProvider.create("Workspace");
    stage.addStep(this.stepProvider.create(
      "We aim to calculate \\(a " + this.computation.getOperation() + " b = c\\)"
    ));

    stage.addStep(this.stepProvider.create(
      "let \\(a\\)",
      this.computation.getA()
    ));

    stage.addStep(this.stepProvider.create(
      "let \\(b\\)",
      this.computation.getB()
    ));

    this.computation.addStage(stage);

  }

  private doStage(schemeStage: EncryptionSchemeStage) {
    let stage = this.stageProvider.create(schemeStage.getName());
    this.computation.addStage(stage);

    schemeStage.getSteps().forEach(schemeStep => {
      let r = this.computeStep(schemeStep);

      let step = this.stepProvider.create(
        schemeStep.getDescription(),
        r
      );

      this.computation.getStageByName(schemeStage.getName()).addStep(step);
    });
  }

  private computeStep(step: EncryptionSchemeStep) {
    // 1) get variable name from compute step
    let varName = step.getCompute().split(" = ")[0];
    console.log("\tvarName: " + varName);
    // 2) compute based on the command
    let command = step.getCompute().split(" = ")[1];
    console.log("\tcommand: " + command);

    let r = this.computer.calculateStepCompute(command, this.computation.getFullScope());

    this.computation.addToScope(varName, r, step.isPublicScope());

    console.log("Completed: " + step.getCompute());

    return r;
  }



  private decrypt() {
    // run Decryption stage
    let stage = this.computation.getEncryptionScheme().getDecryptStage();

    this.doStage(stage);

    this.computation.setC(this.computation.getFullScope().c);

  }

  private registerComputation(): void {
    console.log(__API_URL__);

    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append("Accept", "application/json");
    JSON_HEADERS.append("Content-Type", "application/json");
    let message = this.messageProvider.createRegisterMessage(this.computation);
    this.http.post("http://" + __API_URL__ + "/api/computations", JSON.stringify(message.toJson()), { headers: JSON_HEADERS})
      .subscribe(
        data => this.registerSuccess(data),
        err => console.log(err)
      )
    ;
  }

  private registerSuccess(data) {
    console.log(data);

    this.computation = this.messageResolver.resolveRegisterMessage(data.json(), this.computation);

    this.connectToWebSocket();
  }

  private connectToWebSocket(): void {
    this.socket = new WebSocket("ws://" + __BACKEND_URL__);

    this.socket.addEventListener("open", (ev: Event) => {
      let message = this.messageProvider.createComputeMessage(this.computation);
      this.socket.send(JSON.stringify(message.toJson()));

      this.computation.setState(Computation.STATE_STARTED);
    });

    this.socket.addEventListener("message", (ev: MessageEvent) => {
      console.log(ev);

      let stage = this.stageProvider.create(
        this.computation.getEncryptionScheme().getBackendStage().getName(),
        Stage.HOST_SERVER
      );
      this.computation.addStage(stage);

      this.computation = this.messageResolver.resolveComputeMessage(
        JSON.parse(ev.data),
        this.computation
      );

      if (this.computation.isComplete()) {
        this.socket.close();

        this.decrypt();
      }
    });
  }

}
