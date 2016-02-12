import {Component, View} from "angular2/core";
import {APP_DIRECTIVES} from "../../directives";
import {FormBuilder} from "angular2/common";
import {ControlGroup} from "angular2/common";
import {Validators} from "angular2/common";
import {MathJaxDirective} from "../../directive/mathjax";
import {Computation} from "../../model/computation";
import {RouteParams} from "angular2/router";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";
import {EncryptionScheme} from "../../model/encryption_scheme/encryption_scheme";
import {ComputationProvider} from "../../provider/computation_provider";
import {ComputationRunner} from "../../runner/computation_runner";
import {EncryptionSchemeBitLength} from "../../model/encryption_scheme/encryption_scheme_bit_length";
import {Control} from "angular2/common";


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

  protected capabilities: Array<string> = [];
  protected bitLengths: EncryptionSchemeBitLength[];

  constructor(
    protected routeParams: RouteParams,
    protected encryptionSchemeProvider: EncryptionSchemeProvider,
    protected computationProvider: ComputationProvider,
    protected computationRunner: ComputationRunner
  ) {
    //this.computationForm = formBuilder.group({
    //  "a": ["", Validators.compose([Validators.required, this.skuValidator])],
    //  "b": ["", Validators.compose([Validators.required, this.skuValidator])]
    //});


    this.encryptionScheme = encryptionSchemeProvider.getEncryptionSchemeByName(
      routeParams.get("type")
    );
    this.capabilities = this.encryptionScheme.getCapabilities();
    this.bitLengths = this.encryptionScheme.getBitLengths();

    this.computationModel = this.computationProvider.create(this.encryptionScheme);

    this.computationForm = new ControlGroup({
      a: new Control('', this.maxIntValidator.bind(this)),
      b: new Control('', this.maxIntValidator.bind(this)),
      bitLengths: new Control('', this.computationValidator.bind(this))
    });

  }

  public submit(event: Event): void {
    event.preventDefault();
    this.computationRunner.setComputation(this.computationModel);
    this.computationRunner.runComputation();
  }

  protected computationValidator(control: Control): { [s: string]: boolean } {
    console.log("switch");
    if (this.computationForm) {

      let aCtrl = this.computationForm.controls['a'];
      let bCtrl = this.computationForm.controls['b'];
      console.log(aCtrl.dirty);
      if (aCtrl.dirty) {
        aCtrl.markAsPending();
      }

      if (bCtrl.dirty) {
        bCtrl.markAsDirty();
      }

      if (!control.value) {
        return {invalidSku: true};
      }
    }

  }

  protected maxIntValidator(control: Control) {
    console.log(control.dirty);
    if (this.encryptionScheme && this.computationModel && control.dirty) {
      let currentBitLength = this.encryptionScheme.getBitLength(this.computationModel.getKeyBitLength());

      console.log(control.value + " | " + currentBitLength.getMaxInt());
      if (control.value < 0 || control.value > currentBitLength.getMaxInt()) {
        return {invalidSku: true};
      }
    }
  }

}
