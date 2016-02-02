/*
 * Angular 2 decorators and services
 */
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";


import {APP_DIRECTIVES} from "./directives";
import {ComputationComponent} from "./component/computation/computation";


/*
 * Import Components
 */
import {Index} from "./component/index/index";

/*
 * Angular Directives
 */

/*
 * App Component
 * Top Level Component
 */
let template = require("./app.html");
@Component({
  directives: [ APP_DIRECTIVES ],
  selector: "app", // <app></app>
  template: template
})
@RouteConfig([
  { as: "Home", component: Index, path: "/" },
  { as: "Computation", component: ComputationComponent, path: "/computation/..." },
])
export class App {
  public title: string = "Implementations of Homomorphic Encryption";
}
