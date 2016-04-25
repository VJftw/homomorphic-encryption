import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Index} from './component/index/index.component';
import {ComputationComponent} from './component/computation/computation.component';

/*
 * App Component
 * Top Level Component
 */
@Component({
    directives: [ROUTER_DIRECTIVES],
    selector: 'app', // <app></app>
    template: require('./app.html')
})
@RouteConfig([
    { as: 'Home', component: Index, path: '/' },
    { as: 'Computation', component: ComputationComponent, path: '/computation/...', useAsDefault: true },
])
export class App {
    title: string = 'Implementations of Homomorphic Encryption';
}
