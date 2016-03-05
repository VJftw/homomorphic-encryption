import {Injectable} from 'angular2/core';

import {EncryptionScheme} from '../model/encryption_scheme/encryption_scheme';
import {EncryptionSchemeResolver} from '../resolver/encryption_scheme/encryption_scheme_resolver';

@Injectable()
export class EncryptionSchemeProvider {

  private schemes: Map<string, EncryptionScheme>;

  private schemeJsons = [
    require('json!yaml!../encryption/schemes/pailler.yml')
  ];

  constructor(
    encryptionSchemeResolver: EncryptionSchemeResolver
  ) {
    this.schemes = new Map<string, EncryptionScheme>();
    console.log("WOO");

    this.schemeJsons.forEach(schemeJson => {
      let scheme = encryptionSchemeResolver.fromJson(schemeJson);
      this.schemes.set(scheme.getUniqueName(), scheme);
    });
  }

  public getEncryptionSchemeByName(name: string): EncryptionScheme {
    let r: EncryptionScheme = null;

    this.schemes.forEach(function(value, key) {
      if (key === name) {
        r = value;
      }
    }, this.schemes);

    if (r == null) {
      throw new URIError('Encryption Scheme not found.');
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
