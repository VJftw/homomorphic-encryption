import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {ComputationRunComponent} from './run.component';
import {ComputationSchemesComponent} from "./schemes.component";
import {EncryptionSchemeProviderService} from "../../provider/encryption-scheme.provider.service";
import {EncryptionSchemeResolverService} from "../../resolver/encryption-scheme.resolver.service";
import {BitLengthResolverService} from "../../resolver/encryption-scheme/bit-length.resolver.service";
import {StageResolverService} from "../../resolver/encryption-scheme/stage.resolver.service";
import {StepResolverService} from "../../resolver/encryption-scheme/step.resolver.service";


@Component({
  directives: [RouterOutlet],
  selector: 'computation',
  template: require('./computation.html'),
  providers: [
    EncryptionSchemeProviderService,
    EncryptionSchemeResolverService,
    BitLengthResolverService,
    StageResolverService,
    StepResolverService
  ]
})
@RouteConfig([
  { as: 'Schemes', component: ComputationSchemesComponent, path: '/schemes', useAsDefault: true },
  { as: 'Run', component: ComputationRunComponent, path: '/run/:type' },

])
export class ComputationComponent {
}
