import {Component, View} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {RouteParams} from 'angular2/router';

import {MathJaxDirective} from '../../directive/mathjax';

import {Computation} from "../../model/computation";
import {EncryptionScheme} from "../../model/encryption-scheme";
import {BitLength} from "../../model/encryption-scheme/bit-length";
import {ComputationRunnerService} from "../../runner/computation.runner.service";
import {EncryptionSchemeProviderService} from "../../provider/encryption-scheme.provider.service";
import {ComputationProviderService} from "../../provider/computation.provider.service";
import {OnInit} from "angular2/core";
import {StageProviderService} from "../../provider/stage.provider.service";
import {StepProviderService} from "../../provider/step.provider.service";
import {Computer} from "../../encryption/computer";
import {EncryptionHelper} from "../../encryption/encryption_helper";
import {MessageProviderService} from "../../provider/message.provider.service";
import {MessageResolverService} from "../../resolver/message.resolver.service";
import {MathjaxPipe} from "../../pipe/mathjax.pipe";


@Component({
  selector: 'computation-run',
  providers: [
    ComputationRunnerService,
    ComputationProviderService,
    StageProviderService,
    StepProviderService,
    Computer,
    EncryptionHelper,
    MessageProviderService,
    MessageResolverService
  ]
})
@View({
  directives: [MathJaxDirective],
  template: require('./run.html'),
  pipes: [MathjaxPipe]

})
export class ComputationRunComponent implements OnInit {

  protected computationForm: ControlGroup;
  protected computationModel: Computation;
  protected encryptionScheme: EncryptionScheme;

  protected capabilities: Array<string> = [];
  protected bitLengths: BitLength[];

  constructor(
    private _routeParams: RouteParams,
    private _formBuilder: FormBuilder,
    protected computationRunner: ComputationRunnerService,
    private _encryptionSchemeProviderService: EncryptionSchemeProviderService,
    private _computationProviderService: ComputationProviderService
  ) {}

  ngOnInit() {
    this.encryptionScheme = this._encryptionSchemeProviderService.getEncryptionSchemeByName(
      this._routeParams.get('type')
    );

    this.capabilities = this.encryptionScheme.getCapabilities();
    this.bitLengths = this.encryptionScheme.getBitLengths();

    this.computationModel = this._computationProviderService.create(this.encryptionScheme);

    this.computationForm = this._formBuilder.group({
      a: ['', Validators.required ],
      b: ['', Validators.required ],
      bitLengths: ['', Validators.required]
    }, {
      //validator: this.computationValidator.bind(this)
    });
  }

  public submit(event: Event): void {
    event.preventDefault();
    this.computationRunner.setComputation(this.computationModel);
    this.computationRunner.runComputation();
  }
  //
  //protected computationValidator(group: ControlGroup): { [s: string]: boolean } {
  //  /* tslint:disable:no-string-literal */
  //  let aCtrl = group.controls['a'];
  //  let bCtrl = group.controls['b'];
  //  let bitLengthCtrl = group.controls['bitLengths'];
  //
  //  if (this.computationForm && bitLengthCtrl.value) {
  //
  //    let currentBitLength = this.encryptionScheme.getBitLength(bitLengthCtrl.value);
  //
  //
  //    if (aCtrl.dirty) {
  //      if (aCtrl.value < 0 || aCtrl.value > currentBitLength.getMaxInt()) {
  //        return {invalidSku: true};
  //      }
  //    }
  //
  //    if (bCtrl.dirty) {
  //      if (bCtrl.value < 0 || bCtrl.value > currentBitLength.getMaxInt()) {
  //        return {invalidSku: true};
  //      }
  //    }
  //
  //  }
  //
  //}

}
