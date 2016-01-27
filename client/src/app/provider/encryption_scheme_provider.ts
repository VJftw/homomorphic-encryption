import {Injectable} from "angular2/core";
import {PaillerScheme} from "../encryption/pailler/pailler_scheme";
import {ElGamalScheme} from "../encryption/elgamal/el_gamal_scheme";
import {EncryptionScheme} from "../encryption/encryption_scheme";

@Injectable()
export class EncryptionSchemeProvider {

  private schemes: Map<string, EncryptionScheme>;

  constructor(
    private paillerScheme: PaillerScheme,
    private elGamalEccScheme: ElGamalScheme
  ) {
    this.schemes = new Map<string, EncryptionScheme>();
    this.schemes.set(paillerScheme.getName(), paillerScheme);
    this.schemes.set(elGamalEccScheme.getName(), elGamalEccScheme);
  }

  public getEncryptionSchemeByName(name: string): EncryptionScheme {
    let r: EncryptionScheme = null;

    this.schemes.forEach(function(value, key) {
      if (key === name) {
        r = value;
      }
    }, this.schemes);

    if (r == null) {
      throw new URIError("Encryption Scheme not found.");
    }

    return r;
  }

  public getEncryptionSchemes()  {
    let a = [];

    this.schemes.forEach((value, key) => {
      a.push(value);
    });

    return a;
  }
}
