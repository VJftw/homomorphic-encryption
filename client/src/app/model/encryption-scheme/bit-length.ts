export class BitLength {

    private bitLength: number;
    private maxInt: number;

    constructor(
        bitLength: number,
        maxInt = 99
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

export interface IBitLengthJson {
    bitLength: number;
    maxInt: number;
}
