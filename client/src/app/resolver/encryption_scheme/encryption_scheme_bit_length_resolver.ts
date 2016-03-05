import {Injectable} from 'angular2/core';

import {EncryptionSchemeBitLength, IEncryptionSchemeBitLengthJson} from '../../model/encryption_scheme/encryption_scheme_bit_length';


@Injectable()
export class EncryptionSchemeBitLengthResolver {

  /**
   * @param bitLengthJson
   * @returns {EncryptionSchemeBitLength}
   */
  public fromJson(bitLengthJson: IEncryptionSchemeBitLengthJson): EncryptionSchemeBitLength {
    return new EncryptionSchemeBitLength(
      bitLengthJson.bitLength,
      bitLengthJson.maxInt
    );
  }

}
