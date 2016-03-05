import {BitLength} from "./encryption-scheme/bit-length";
import {Stage} from "./encryption-scheme/stage";
import {IBitLengthJson} from "./encryption-scheme/bit-length";
import {IStageJson} from "./encryption-scheme/stage";


export class EncryptionScheme {

  private _uniqueName: string;
  private _readableName: string;
  private _description: string;

  private _bitLengths: BitLength[];

  private _setupStages: Stage[];
  private _encryptionStages: Stage[];
  private _backendStages: Map<string, Stage>;
  private _decryptionStages: Stage[];

  constructor(
    uniqueName: string,
    readableName: string,
    description: string
  ) {
    this._uniqueName = uniqueName;
    this._readableName = readableName;
    this._description = description;

    this._bitLengths = [];
    this._setupStages = [];
    this._encryptionStages = [];
    this._backendStages = new Map<string, Stage>();
    this._decryptionStages = [];
  }

  public getUniqueName(): string {
    return this._uniqueName;
  }

  public getReadableName(): string {
    return this._readableName;
  }

  public getDescription(): string {
    return this._description;
  }

  public getCapabilities() {
    let a = [];

    this._backendStages.forEach((value, key) => {
      a.push(key);
    });

    return a;
  }

  public addBitLength(bitLength: BitLength): EncryptionScheme {
    this._bitLengths.push(bitLength);

    return this;
  }

  public getBitLengths(): BitLength[] {
    return this._bitLengths;
  }

  public getBitLength(length: number): BitLength {
    for (let bitLength of this._bitLengths) {
      if (bitLength.getBitLength() === +length) {
        return bitLength;
      }
    }

    throw new RangeError('Bit Length ' + length + ' not found.');
  }

  public getSetupStages(): Stage[] {
    return this._setupStages;
  }

  public addSetupStage(stage: Stage) {
    this._setupStages.push(stage);

    return this;
  }

  public getEncryptionStages(): Stage[] {
    return this._encryptionStages;
  }

  public addEncryptionStage(stage: Stage) {
    this._encryptionStages.push(stage);

    return this;
  }

  public getBackendStageByOperation(operation: string) {
    if (this._backendStages.has(operation)) {
      return this._backendStages.get(operation);
    }

    throw new RangeError(`Operation not available: ${operation}`)
  }

  public addBackendStage(operation: string, stage: Stage) {
    this._backendStages.set(operation, stage);

    return this;
  }

  public getDecryptionStages(): Stage[] {
    return this._decryptionStages;
  }

  public addDecryptionStage(stage: Stage) {
    this._decryptionStages.push(stage);

    return this;
  }

}

export interface IEncryptionSchemeJson {
  uniqueName: string;
  readableName: string;
  description: string;
  bitLengths: IBitLengthJson[];
  stages: {
    setup: IStageJson[],
    encryption: IStageJson[],
    backend: Map<string, IStageJson>,
    decryption: IStageJson[]
  }
}
