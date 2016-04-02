import {Component, OnInit} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {EncryptionSchemeProviderService} from '../../provider/encryption-scheme.provider.service.ts';
import {StageResolverService} from '../../resolver/encryption-scheme/stage.resolver.service';
import {BitLengthResolverService} from '../../resolver/encryption-scheme/bit-length.resolver.service';
import {StepResolverService} from '../../resolver/encryption-scheme/step.resolver.service';
import {EncryptionSchemeResolverService} from '../../resolver/encryption-scheme.resolver.service';


@Component({
  directives: [RouterLink],
  selector: 'computation-index',
  template: require('./index.html'),
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
