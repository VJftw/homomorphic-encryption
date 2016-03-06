import {Injectable} from 'angular2/core';
import {EncryptionSchemeResolverService} from '../resolver/encryption-scheme.resolver.service';
import {EncryptionScheme} from "../model/encryption-scheme";

@Injectable()
export class EncryptionSchemeProviderService {

  private schemes: Map<string, EncryptionScheme>;

  private schemeJsons = [
    require('json!yaml!../encryption/schemes/pailler.yml'),
    require('json!yaml!../encryption/schemes/rsa.yml'),
    require('json!yaml!../encryption/schemes/gorti.yml'),
  ];

  constructor(
    private _encryptionSchemeResolverService: EncryptionSchemeResolverService
  ) {
    this.schemes = new Map<string, EncryptionScheme>();

    this.schemeJsons.forEach(schemeJson => {
      let scheme = _encryptionSchemeResolverService.fromJson(schemeJson);
      this.schemes.set(scheme.getUniqueName(), scheme);
    });
  }

  public getEncryptionSchemes()  {
    let a = [];

    this.schemes.forEach((value, key) => {
      a.push(value);
    });

    console.log(a);

    return a;
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
}
