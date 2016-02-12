export class EncryptionSchemeBitLength {

  private bitLength: number;
  private maxInt: number;

  constructor(
    bitLength: number,
    maxInt: number=99
  ) {
    this.bitLength = bitLength;
    this.maxInt = maxInt;
  }

  public getBitLength(): number {
    return this.bitLength;
  }

  public getMaxInt(): number {
    return this.maxInt;
  }

}

export interface IEncryptionSchemeBitLengthJson {
  bitLength: number;
  maxInt: number;
}