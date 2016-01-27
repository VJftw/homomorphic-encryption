import {Computation} from "../model/computation";
import {Http} from "angular2/http";
import {ComputationResolver} from "../resolver/computation_resolver";
import {StepProvider} from "../provider/step_provider";
import {StageProvider} from "../provider/stage_provider";
import {Headers} from "angular2/http";

/**
 * EncryptionScheme
 */
export abstract class EncryptionScheme {

  protected computation: Computation;
  protected socket: WebSocket;

  constructor(
    protected stageProvider: StageProvider,
    protected stepProvider: StepProvider,
    protected computationResolver: ComputationResolver,
    protected http: Http
  ) {
  }

  public setComputation(computation: Computation): EncryptionScheme {
    this.computation = computation;

    return this;
  }

  public getComputation(): Computation {
    return this.computation;
  }

  protected registerComputation(): void {
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

  protected abstract decrypt(): void;

  /**
   * Return the name of the Encryption Scheme
   */
  public abstract getName(): string;

  /**
   * Return a description of the Encryption Scheme
   */
  public abstract getDescription(): string;

  /**
   * Return what calculations the scheme can perform
   */
  public abstract getCapabilities(): Array<string>;

  /**
   * execute the encryption scheme with the given numbers and operator
   */
  public abstract doScheme(): void;

}

export class Operation {

  public static ADD = "+";
  public static SUBTRACT = "-";
  public static MULTIPLY = "*";
  public static DIVIDE = "/";

}
