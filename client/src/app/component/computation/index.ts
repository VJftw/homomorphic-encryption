import {Component} from 'angular2/core';
import {EncryptionSchemeProvider} from '../../provider/encryption_scheme_provider';


@Component({
  directives: [],
  selector: 'computation-index',
  template: require('./index.html')
})
export class ComputationIndex {

  public schemes: any;

  constructor(
    protected encryptionSchemeProvider: EncryptionSchemeProvider
  ) {
    console.log("WOAS");
    this.schemes = encryptionSchemeProvider.getEncryptionSchemes();
  }
}
