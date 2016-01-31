import {Injectable} from "angular2/core";

import {Computation} from "../model/computation";
import {EncryptionScheme} from "../model/encryption_scheme/encryption_scheme";
import {StageProvider} from "../provider/stage_provider";
import {StepProvider} from "../provider/step_provider";
import {ComputationResolver} from "../resolver/computation_resolver";
import {Http} from "angular2/http";
import {Headers} from "angular2/http";
import {Computer} from "../encryption/computer";

@Injectable()
export class ComputationRunner {

  private computation: Computation;

  private encryptionScheme: EncryptionScheme;

  constructor(
    private stageProvider: StageProvider,
    private stepProvider: StepProvider,
    private computationResolver: ComputationResolver,
    private computer: Computer,
    private http: Http
  ) {
  }

  public setComputation(computation: Computation) {
    this.computation = computation;

    return this;
  }

  public setEncryptionScheme(scheme: EncryptionScheme) {
    this.encryptionScheme = scheme;

    return this;
  }

  public getComputation(): Computation {
    return this.computation;
  }

  public doScheme(): void {
    this.computer.reset();

    stages = this.encryptionScheme.getStages();

    stages.forEach(stage => {
      if (stage.getName() === "Decryption") {
        this.registerComputation();
      } else {
        stage.getSteps().forEach(step => {
          this.computer.computeStep(step);
        });
      }
    });
  }

  private decrypt() {
    // add cX to computerScope

    // run Decryption stage
  }

  private registerComputation(): void {
    console.log(__API_URL__);

    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append("Accept", "application/json");
    JSON_HEADERS.append("Content-Type", "application/json");
    this.http.post("http://" + __API_URL__ + "/api/computations", JSON.stringify(this.computation.toJson()), { headers: JSON_HEADERS})
      .subscribe(
        data => this.connectToWebSocket(data),
        err => console.log(err)
      )
    ;
  }

  protected connectToWebSocket(data): void {
    console.log(data);
    this.computation.setHashId(data.json().hashId);
    this.socket = new WebSocket("ws://" + __BACKEND_URL__);

    this.socket.addEventListener("open", (ev: Event) => {
      this.socket.send(JSON.stringify({
        "action": "computation/compute",
        "data": {
          "hashId": this.computation.getHashId()
        }
      }));
    });

    this.socket.addEventListener("message", (ev: MessageEvent) => {
      console.log(ev);
      this.computation = this.computationResolver.fromJson(
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