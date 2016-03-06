import {MessageInterface} from './message-interface';
import {EncryptionScheme} from '../model/encryption-scheme';


export class RegisterMessage implements MessageInterface {

  constructor(
    private encryptionScheme: EncryptionScheme
  ) {
  }

  public toJson(): {} {
    return {
      'encryptionScheme': this.encryptionScheme.getUniqueName(),
    };
  }

}

export interface IRegisterMessageResponseJson {
  hashId: string;
}
