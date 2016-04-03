import {Component, OnInit} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {EncryptionSchemeProviderService} from '../../provider/encryption-scheme.provider.service.ts';
import {MathJaxDirective} from '../../directive/mathjax';


@Component({
  directives: [
    RouterLink,
    MathJaxDirective
  ],
  selector: 'computation-index',
  template: require('./schemes.html'),
})
export class ComputationSchemesComponent implements OnInit {

  public schemes: any;

  constructor(
    private _encryptionSchemeProviderService: EncryptionSchemeProviderService
  ) {}

  ngOnInit() {
    this.schemes = this._encryptionSchemeProviderService.getEncryptionSchemes();
  }
}
