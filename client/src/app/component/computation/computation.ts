import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {ComputationRun} from './run';
import {ComputationIndex} from './index';
import {RouterOutlet} from "angular2/router";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";


@Component({
  directives: [RouterOutlet],
  selector: 'computation',
  template: require('./computation.html'),
  providers: [EncryptionSchemeProvider]

})
@RouteConfig([
  { as: 'Index', component: ComputationIndex, path: '/', useAsDefault: true },
  { as: 'Run', component: ComputationRun, path: '/run/:type' },

])
export class ComputationComponent {

  constructor() {
    console.log("AAAAA");
  }

}
