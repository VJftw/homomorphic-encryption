import {Injectable} from "angular2/core";
import {PaillerScheme} from "../encryption/pailler/pailler_scheme";
import {EncryptionScheme} from "../encryption/encryption_scheme";

@Injectable()
export class EncryptionSchemeProvider {

  private schemes: Map<string, EncryptionScheme>;

  constructor(
    private paillerScheme: PaillerScheme
  ) {
    this.schemes = new Map<string, EncryptionScheme>();
    this.schemes.set(paillerScheme.getName(), paillerScheme);
  }

  public getEncryptionSchemeByName(name: string): EncryptionScheme {
    let r: EncryptionScheme = null;

    this.schemes.forEach(function(value, key) {
      if (key === name) {
        r = value;
      }
    }, this.schemes);

    return r;
  }
}
