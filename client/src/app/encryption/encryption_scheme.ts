import {Computation} from "../model/computation";
import {Http} from "angular2/http";
import {ComputationResolver} from "../resolver/computation_resolver";
import {StepProvider} from "../provider/step_provider";
import {StageProvider} from "../provider/stage_provider";

/**
 * EncryptionScheme
 */
export abstract class EncryptionScheme {

  protected computation: Computation;
  protected socket: WebSocket;

  constructor(
    protected stageProvder: StageProvider,
    protected stepProvider: StepProvider,
    protected computationResolver: ComputationResolver,
    protected http: Http
  ) {
    this.socket = new WebSocket("ws://" + __BACKEND_URL__);
  }

  public setComputation(computation: Computation): EncryptionScheme {
    this.computation = computation;

    return this;
  }

  public getComputation(): Computation {
    return this.computation;
  }

  /**
   * Return the name of the Encryption Scheme
   */
  abstract getName(): string;

  /**
   * Return a description of the Encryption Scheme
   */
  abstract getDescription(): string;

  /**
   * Return what calculations the scheme can perform
   */
  abstract getCapabilities(): Array<string>;

  /**
   * execute the encryption scheme with the given numbers and operator
   */
  abstract doScheme(): void;

}

export class Operation {

  public static ADD = "+";
  public static SUBTRACT = "-";
  public static MULTIPLY = "*";
  public static DIVIDE = "/";

}
