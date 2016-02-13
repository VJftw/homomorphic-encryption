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
    fb: FormBuilder,
    protected computationProvider: ComputationProvider,
    protected computationRunner: ComputationRunner
  ) {

    this.encryptionScheme = encryptionSchemeProvider.getEncryptionSchemeByName(
      routeParams.get("type")
    );
    this.capabilities = this.encryptionScheme.getCapabilities();
    this.bitLengths = this.encryptionScheme.getBitLengths();

    this.computationModel = this.computationProvider.create(this.encryptionScheme);

    this.computationForm = fb.group({
      a: ["", Validators.required ],
      b: ["", Validators.required ],
      bitLengths: ["", Validators.required]
    }, {
      validator: this.computationValidator.bind(this)
    });

  }

  public submit(event: Event): void {
    event.preventDefault();
    this.computationRunner.setComputation(this.computationModel);
    this.computationRunner.runComputation();
  }

  protected computationValidator(group: ControlGroup): { [s: string]: boolean } {

    let aCtrl = group.controls["a"];
    let bCtrl = group.controls["b"];
    let bitLengthCtrl = group.controls["bitLengths"];

    if (this.computationForm && bitLengthCtrl.value) {

      let currentBitLength = this.encryptionScheme.getBitLength(bitLengthCtrl.value);


      if (aCtrl.dirty) {
        if (aCtrl.value < 0 || aCtrl.value > currentBitLength.getMaxInt()) {
          return {invalidSku: true};
        }
      }

      if (bCtrl.dirty) {
        if (bCtrl.value < 0 || bCtrl.value > currentBitLength.getMaxInt()) {
          return {invalidSku: true};
        }
      }

    }

  }

}
