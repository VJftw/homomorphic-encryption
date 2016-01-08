/*
 * Angular 2 decorators and services
 */
import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";


import {APP_DIRECTIVES} from "./directives";
import {ComputationAdd} from "./component/computation/add";


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
  { as: "Add", component: ComputationAdd, path: "/add" },
])
export class App {
  public title: string = "An Implementation of Homomorphic Encryption";
}
