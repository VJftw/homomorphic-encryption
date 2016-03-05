import {Component} from 'angular2/core';
import {RouteConfig} from 'angular2/router';

import {ComputationRun} from './run';
import {ComputationIndex} from './index';


@Component({
  selector: 'computation',
  template: require('./computation.html')
})
@RouteConfig([
  { as: 'Index', component: ComputationIndex, path: '/' },
  { as: 'Run', component: ComputationRun, path: '/run/:type' },
])
export class ComputationComponent {

}
