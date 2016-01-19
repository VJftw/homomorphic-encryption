import {Component} from "angular2/core";
import {APP_DIRECTIVES} from "../../directives";


@Component({
  directives: [ APP_DIRECTIVES ],
  selector: "computation-index",
  template: require("./index.html")
})
export class ComputationIndex {

  public schemes = [
    "Pailler"
  ];
}
