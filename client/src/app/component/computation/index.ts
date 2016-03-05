import {Component} from 'angular2/core';
import {EncryptionSchemeProvider} from '../../provider/encryption_scheme_provider';
import {RouterLink} from "angular2/router";


@Component({
  directives: [RouterLink],
  selector: 'computation-index',
  template: require('./index.html'),
})
export class ComputationIndex {

  public schemes: any;

  constructor(
    protected encryptionSchemeProvider: EncryptionSchemeProvider
  ) {
    this.schemes = encryptionSchemeProvider.getEncryptionSchemes();
  }
}
