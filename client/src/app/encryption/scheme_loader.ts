import {Injectable} from "angular2/core";

@Injectable()
export class SchemeLoader {

  private schemeJsons = [
    require("json!yaml!../encryption/schemes/pailler.yml")
  ];

  constructor() {

    this.schemeJsons.forEach(schemeJson => {
      console.log(schemeJson);
    });

  }
}
