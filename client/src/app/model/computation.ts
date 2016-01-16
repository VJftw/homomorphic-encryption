import {PrivateKey, PublicKey} from "../encryption/pailler/pailler";
import {BigInteger} from "jsbn";
import {Stage} from "./stage";

export class Computation {

  public static SCHEME_PAILLER = 1;

  public static STATE_NEW = 0;
  public static STATE_STARTED = 1;
  public static STATE_COMPLETE = 2;

  protected _hashId: string;
  protected aEncrypted: BigInteger;
  protected bEncrypted: BigInteger;
  protected publicKey: PublicKey;
  protected timestamp: Date;
  protected scheme: string;
  protected operation: string;
  protected state: number;
  protected stages: Stage[];

  private a: BigInteger;
  private b: BigInteger;
  private privateKey: PrivateKey;

  constructor() {
    this.state = Computation.STATE_NEW;
    this.stages = [];
  }

  public setHashId(hashId: string): Computation {
    this._hashId = hashId;

    return this;
  }

  public getHashId(): string {
    return this._hashId;
  }

  public getA(): BigInteger {
    return this.a;
  }

  public getB(): BigInteger {
    return this.b;
  }

  public setPrivateKey(privateKey: PrivateKey) {
    this.privateKey = privateKey;

    return this;
  }

  public getPrivateKey(): PrivateKey {
    return this.privateKey;
  }

  public setPublicKey(publicKey: PublicKey) {
    this.publicKey = publicKey;

    return this;
  }

  public getPublicKey() : PublicKey {
    return this.publicKey;
  }

  public setAEncrypted(aEncrypted: BigInteger) {
    this.aEncrypted = aEncrypted;

    return this;
  }

  public getAEncrypted(): BigInteger {
    return this.aEncrypted;
  }

  public setBEncrypted(bEncrypted: BigInteger) {
    this.bEncrypted = bEncrypted;

    return this;
  }

  public getBEncrypted(): BigInteger {
    return this.bEncrypted;
  }

  public setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;

    return this;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getOperation(): string {
    return this.operation;
  }

  public setOperation(operation: string) {
    this.operation = operation;

    return this;
  }

  public getScheme(): string {
    return this.scheme;
  }

  public setScheme(scheme: string): Computation {
    this.scheme = scheme;

    return this;
  }

  public setState(state: number) {
    this.state = state;

    return this;
  }

  public getState(): number {
    return this.state;
  }

  public isNew(): boolean {
    return this.state === Computation.STATE_NEW;
  }

  public isStarted(): boolean {
    return this.state === Computation.STATE_STARTED;
  }

  public isComplete(): boolean {
    return this.state === Computation.STATE_COMPLETE;
  }

  public addStage(stage: Stage): Computation {
    this.stages.push(stage);

    return this;
  }

  public getStages(): Array<Stage> {
    return this.stages;
  }

  public getStageByName(name: string): Stage {
    let r: Stage = null;

    this.stages.forEach(function(value) {
      if (value.getName() === name) {
        r = value;
      }
    }, this.stages);

    return r;
  }

  public toJson() {
    let stages = [];
    this.stages.forEach(function(stage) {
      stages.push(stage.toJson());
    });
    return {
      "scheme": this.getScheme(),
      "operation": this.getOperation(),
      "aEncrypted": this.getAEncrypted().toString(),
      "bEncrypted": this.getBEncrypted().toString(),
      "publicKey": this.getPublicKey().toJson(),
      "stages": stages
    };
  }
}
