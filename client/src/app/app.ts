/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';

import {Index} from './component/index/index';
import {ComputationComponent} from './component/computation/computation';

/*
 * App Component
 * Top Level Component
 */
@Component({
  directives: [ ...ROUTER_DIRECTIVES ],
  selector: 'app', // <app></app>
  template: require('./app.html')
})
@RouteConfig([
  { as: 'Home', component: Index, path: '/' },
  { as: 'Computation', component: ComputationComponent, path: '/computation/...', useAsDefault: true },
])
export class App {
  public title: string = 'Implementations of Homomorphic Encryption';

  constructor() {
    console.log('API Address: ' + process.env['API_ADDRESS']);
  }
}