import {Component} from "angular2/core";
import {APP_DIRECTIVES} from "../../directives";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";


@Component({
  directives: [ APP_DIRECTIVES ],
  selector: "computation-index",
  template: require("./index.html")
})
export class ComputationIndex {

  public schemes: any;

  constructor(
    protected encryptionSchemeProvider: EncryptionSchemeProvider
  ) {
    this.schemes = encryptionSchemeProvider.getEncryptionSchemes();
  }
}
