// import {PrivateKeyInterface, PublicKeyInterface} from "../encryption/key";
import {BigInteger} from "jsbn";
import {Stage} from "./stage";
import {EncryptionScheme} from "./encryption_scheme/encryption_scheme";

export class Computation {

  public static STATE_NEW = 0;
  public static STATE_STARTED = 1;
  public static STATE_COMPLETE = 2;

  protected _hashId: string;
  protected timestamp: Date;
  protected encryptionScheme: EncryptionScheme;
  protected operation: string;
  protected state: number;
  protected stages: Stage[];

  private privateScope = {};
  private publicScope = {};

  private a: BigInteger;
  private b: BigInteger;
  private c: BigInteger;

  constructor() {
    this.state = Computation.STATE_NEW;
    this.stages = [];
    this.privateScope = {};
    this.publicScope = {};
  }

  public getFullScope(): IScopeObject {
    let r = {};
    for (let varName in this.privateScope) {
      if (this.privateScope.hasOwnProperty(varName)) {
        r[varName] = this.privateScope[varName];
      }
    }

    for (let varName in this.publicScope) {
      if (this.publicScope.hasOwnProperty(varName)) {
        r[varName] = this.publicScope[varName];
      }
    }
    return r;
  }

  public getPublicScope() {
    return this.publicScope;
  }

  public addToScope(varName: string, value: BigInteger, toPublic = false) {
    if (toPublic) {
      this.publicScope[varName] = value;
    } else {
      this.privateScope[varName] = value;
    }

    return this;
  }

  public getFromScope(varName: string) {
    if (varName in this.publicScope) {
      return this.publicScope[varName];
    } else if (varName in this.privateScope) {
      return this.privateScope[varName];
    }

    throw new RangeError("Variable not found in scope");
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

  public getC(): BigInteger {
    return this.c;
  }

  public setC(c: BigInteger): Computation {
    this.c = c;

    return this;
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

  public getEncryptionScheme(): EncryptionScheme {
    return this.encryptionScheme;
  }

  public setEncryptionScheme(scheme: EncryptionScheme): Computation {
    this.encryptionScheme = scheme;

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
}

export interface IScopeObject {
  a?: BigInteger;
  b?: BigInteger;
  c?: BigInteger;
}
