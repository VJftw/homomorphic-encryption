import {Component, View} from "angular2/core";
import {APP_DIRECTIVES} from "../../directives";
import {FormBuilder} from "angular2/common";
import {ControlGroup} from "angular2/common";
import {Validators} from "angular2/common";
import {Computation} from "../../model/computation";
import {EncryptionScheme} from "../../encryption/encryption_scheme";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";
import {ChangeDetectionStrategy} from "angular2/core";
import {MathJaxDirective} from "../../directive/mathjax";

/**
 *
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: "computation-add"
})
@View({
  directives: [APP_DIRECTIVES, MathJaxDirective],
  template: require("./add.html"),
})
export class ComputationAdd {

  protected computationForm: ControlGroup;
  protected computationModel: Computation;
  protected encryptionScheme: EncryptionScheme;
  protected formSubmitted: boolean;

  protected a: number = 0;

  protected computationSchemes = [
    "Pailler"
  ];

  constructor(
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
    this.formSubmitted = false;

  }

  public setEncryptionScheme(schemeName: string): ComputationAdd {
    this.encryptionScheme = this.encryptionSchemeProvider.getEncryptionSchemeByName(schemeName);
    this.computationModel.setOperation(this.encryptionScheme.getCapabilities()[0]);

    return this;
  }

  public submit(event: Event): void {
    console.log(event);
    event.preventDefault();
    this.formSubmitted = true;
    console.log("WOO");
    console.log(this.computationModel);
    console.log(this.encryptionScheme);
    this.encryptionScheme.setComputation(this.computationModel);
    this.encryptionScheme.doScheme();

    this.updateComputation(event);


  }

  private updateComputation(event: Event) {
    setTimeout(() => {
      console.log(this.encryptionScheme.getComputation());
      this.updateComputation(event);
      this.computationModel = this.encryptionScheme.getComputation();
      this.a++;
    }, 1000);
  }
}
