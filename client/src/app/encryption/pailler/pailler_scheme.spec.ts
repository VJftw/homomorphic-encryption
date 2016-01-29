import {
  it
} from "angular2/testing";

import {PaillerScheme} from "./pailler_scheme";
import {Operation} from "../encryption_scheme";

describe("PaillerScheme", () => {

  let paillerScheme: PaillerScheme;

  let pailler = jasmine.createSpyObj("pailler", [""]);
  let stageProvider = jasmine.createSpyObj("stageProvider", [""]);
  let stepProvider = jasmine.createSpyObj("stepProvider", [""]);
  let computationResolver = jasmine.createSpyObj("computationResolver", [""]);
  let encryptionHelper = jasmine.createSpyObj("encryptionHelper", [""]);
  let http = jasmine.createSpyObj("http", [""]);

  beforeEach(() => {
    paillerScheme = new PaillerScheme(
      pailler,
      stageProvider,
      stepProvider,
      computationResolver,
      encryptionHelper,
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