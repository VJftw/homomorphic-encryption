import {Injectable} from 'angular2/core';
import {BitLength, IBitLengthJson} from "../../model/encryption-scheme/bit-length";

@Injectable()
export class BitLengthResolverService {

  /**
   *
   * @param bitLengthJson
   * @returns {EncryptionSchemeBitLength}
   */
  public fromJson(bitLengthJson: IBitLengthJson): BitLength {
    return new BitLength(
      bitLengthJson.bitLength,
      bitLengthJson.maxInt
    );
  }

}
