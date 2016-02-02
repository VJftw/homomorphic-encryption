import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {APP_DIRECTIVES} from "../../directives";

import {ComputationRun} from "./run";
import {ComputationIndex} from "./index";


@Component({
  directives: [ APP_DIRECTIVES ],
  selector: "computation",
  template: require("./computation.html")
})
@RouteConfig([
  { as: "Index", component: ComputationIndex, path: "/" },
  { as: "Run", component: ComputationRun, path: "/run/:type" },
])
export class ComputationComponent {

}
