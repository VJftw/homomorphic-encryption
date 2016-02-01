import {MessageInterface} from "./message_interface";
import {EncryptionScheme} from "../model/encryption_scheme/encryption_scheme";


export class RegisterMessage implements MessageInterface {

  constructor(
    private encryptionScheme: EncryptionScheme
  ) {
  }

  public toJson(): {} {
    return {
      "encryptionScheme": this.encryptionScheme.getUniqueName(),
      // "keyBitSize": this.keyBitSize
    };
  }

}

export interface IRegisterMessageResponseJson {
  hashId: string;
}
