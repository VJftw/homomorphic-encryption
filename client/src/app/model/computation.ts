import {BigInteger} from 'jsbn';
import {Stage} from './stage';
import {EncryptionScheme} from './encryption_scheme/encryption_scheme';


export class Computation {

  public static STATE_NEW = 0;
  public static STATE_STARTED = 1;
  public static STATE_BACKEND_CONNECT = 2;
  public static STATE_BACKEND_CONNECTED = 3;
  public static STATE_COMPLETE = 4;

  protected _hashId: string;
  protected timestamp: Date;
  protected keyBitLength: number;
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

  /**
   * Returns the full(Public and Private) scope
   * @returns IScopeObject
   */
  public getFullScope(): {} {
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

  /**
   * Returns the Public scope
   * @returns {{}}
   */
  public getPublicScope() {
    return this.publicScope;
  }

  /**
   * Adds a given variable and its value to the scope. Default is Private
   * @param varName
   * @param value
   * @param toPublic
   * @returns {Computation}
   */
  public addToScope(varName: string, value: BigInteger, toPublic = false) {
    if (toPublic) {
      this.publicScope[varName] = value;
    } else {
      this.privateScope[varName] = value;
    }

    return this;
  }

  /**
   * Returns a value given by its variable name from the scope
   * @param varName
   * @returns {any}
   */
  public getFromScope(varName: string) {
    if (varName in this.publicScope) {
      return this.publicScope[varName];
    } else if (varName in this.privateScope) {
      return this.privateScope[varName];
    }

    throw new RangeError('Variable not found in scope');
  }

  /**
   * Sets the unique hashId
   * @param hashId
   * @returns {Computation}
   */
  public setHashId(hashId: string): Computation {
    this._hashId = hashId;

    return this;
  }

  /**
   * Returns the unique hashId
   * @returns {string}
   */
  public getHashId(): string {
    return this._hashId;
  }

  /**
   * Returns the value of A
   * @returns {BigInteger}
   */
  public getA(): BigInteger {
    return this.a;
  }

  /**
   * Returns the value of B
   * @returns {BigInteger}
   */
  public getB(): BigInteger {
    return this.b;
  }

  /**
   * Returns the value of C
   * @returns {BigInteger}
   */
  public getC(): BigInteger {
    return this.c;
  }

  /**
   * Sets the value of C
   * @param c
   * @returns {Computation}
   */
  public setC(c: BigInteger): Computation {
    this.c = c;

    return this;
  }

  /**
   * Sets the Timestamp
   * @param timestamp
   * @returns {Computation}
   */
  public setTimestamp(timestamp: Date) {
    this.timestamp = timestamp;

    return this;
  }

  /**
   * Returns the Timestamp
   * @returns {Date}
   */
  public getTimestamp(): Date {
    return this.timestamp;
  }

  /**
   * Returns the bit length used in key generation
   * @returns {number}
   */
  public getBitLength(): number {
    return this.keyBitLength;
  }

  /**
   * Sets the bit length used in key generation
   * @param bits
   * @returns {Computation}
   */
  public setBitLength(bits: number) {
    this.keyBitLength = bits;

    return this;
  }

  /**
   * Returns the operation
   * @returns {string}
   */
  public getOperation(): string {
    return this.operation;
  }

  /**
   * Sets the operation
   * @param operation
   * @returns {Computation}
   */
  public setOperation(operation: string) {
    this.operation = operation;

    return this;
  }

  /**
   * Returns the EncryptionScheme
   * @returns {EncryptionScheme}
   */
  public getEncryptionScheme(): EncryptionScheme {
    return this.encryptionScheme;
  }

  /**
   * Sets the EncryptionScheme
   * @param scheme
   * @returns {Computation}
   */
  public setEncryptionScheme(scheme: EncryptionScheme): Computation {
    this.encryptionScheme = scheme;

    return this;
  }

  /**
   * Sets the state of the Computation. Use the public static variables.
   * @param state
   * @returns {Computation}
   */
  public setState(state: number) {
    this.state = state;

    return this;
  }

  /**
   * Returns the state of the Computation
   * @returns {number}
   */
  public getState(): number {
    return this.state;
  }

  /**
   * Returns whether or not the Computation is new
   * @returns {boolean}
   */
  public isNew(): boolean {
    return this.state === Computation.STATE_NEW;
  }

  /**
   * Returns whether or not the Computation has started
   * @returns {boolean}
   */
  public isStarted(): boolean {
    return this.state === Computation.STATE_STARTED;
  }

  /**
   * Returns whether or not the Computation is completed
   * @returns {boolean}
   */
  public isComplete(): boolean {
    return this.state === Computation.STATE_COMPLETE;
  }

  /**
   * Adds a Stage
   * @param stage
   * @returns {Computation}
   */
  public addStage(stage: Stage): Computation {
    this.stages.push(stage);

    return this;
  }

  /**
   * Returns the Stages
   * @returns {Stage[]}
   */
  public getStages(): Array<Stage> {
    return this.stages;
  }

  /**
   * Returns a Stage given by its name
   * @param name
   * @returns {Stage}
   */
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
