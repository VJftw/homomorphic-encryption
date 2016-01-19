import {
  it
} from "angular2/testing";

import {PaillerScheme} from "./pailler_scheme";
import {Operation} from "../encryption_scheme";

describe("PaillerScheme", () => {

  let paillerScheme: PaillerScheme;

  let pailler: any;
  let stageProvider: any;
  let stepProvider: any;
  let computationResolver: any;
  let http: any;

  beforeEach(() => {
    pailler = jasmine.createSpyObj("pailler", [""]);
    stageProvider = jasmine.createSpyObj("stageProvider", [""]);
    stepProvider = jasmine.createSpyObj("stepProvider", [""]);
    computationResolver = jasmine.createSpyObj("computationResolver", [""]);
    http = jasmine.createSpyObj("http", [""]);

    paillerScheme = new PaillerScheme(
      pailler,
      stageProvider,
      stepProvider,
      computationResolver,
      http
    );
  });

  it("should return the correct name", () => {
    expect(paillerScheme.getName())
      .toEqual("Pailler")
    ;
  });

  it("should return the correct capabilities", () => {
    expect(paillerScheme.getCapabilities())
      .toEqual([Operation.ADD])
    ;
  });

  it("should return the computation", () => {
    expect(paillerScheme.getComputation())
      .toBeUndefined()
    ;
  });

  it("should set the computation", () => {
    let computation = jasmine.createSpyObj("computation", [""]);
    expect(paillerScheme.setComputation(computation))
      .toBe(paillerScheme)
    ;

    expect(paillerScheme.getComputation())
      .toBe(computation)
    ;
  });

});