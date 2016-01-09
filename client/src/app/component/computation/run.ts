import {Component, View} from "angular2/core";
import {APP_DIRECTIVES} from "../../directives";
import {FormBuilder} from "angular2/common";
import {ControlGroup} from "angular2/common";
import {Validators} from "angular2/common";
import {MathJaxDirective} from "../../directive/mathjax";
import {Computation} from "../../model/computation";
import {RouteParams} from "angular2/router";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";
import {EncryptionScheme} from "../../encryption/encryption_scheme";


@Component({
  selector: "computation-run"
})
@View({
  directives: [APP_DIRECTIVES, MathJaxDirective],
  template: require("./run.html")
})
export class ComputationRun {

  protected computationForm: ControlGroup;
  protected computationModel: Computation;
  protected encryptionScheme: EncryptionScheme;

  protected capabilities: Array<string>;

  protected formSubmitted = false;

  constructor(
    protected routeParams: RouteParams,
    protected formBuilder: FormBuilder,
    protected encryptionSchemeProvider: EncryptionSchemeProvider
  ) {
    this.computationForm = formBuilder.group({
      "a": ["", Validators.compose([
        Validators.required
      ])],
      "b": ["", Validators.required]
    });

    this.computationModel = new Computation();

    this.encryptionScheme = encryptionSchemeProvider.getEncryptionSchemeByName(
      routeParams.get("type")
    );
    this.capabilities = this.encryptionScheme.getCapabilities();

    this.computationModel.setScheme(this.encryptionScheme.getName());
    this.computationModel.setOperation(this.capabilities[0]);
  }

  public submit(event: Event): void {
    console.log(event);
    event.preventDefault();
    this.formSubmitted = true;
    this.encryptionScheme.setComputation(this.computationModel);
    this.encryptionScheme.doScheme();
  }

}