import {
  it
} from "angular2/testing";

import {FormBuilder, Validators} from "angular2/common";
import {RouteParams} from "angular2/router";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";

import {ComputationRun} from "./run";
import {EncryptionSchemeBitLength} from "../../model/encryption_scheme/encryption_scheme_bit_length";


describe("ComputationRun", () => {

  let formBuilder = jasmine.createSpyObj("formBuilder", ["group"]);
  let routeParams = jasmine.createSpyObj("routeParams", ["get"]);
  let encryptionSchemeProvider = jasmine.createSpyObj("encryptionSchemeProvider", ["getEncryptionSchemeByName"]);
  let computationProvider = jasmine.createSpyObj("computationProvider", ["create"]);
  let computationRunner = jasmine.createSpyObj("computationRunner", ["setComputation", "runComputation"]);

  let computationRun: ComputationRun;

  let encryptionScheme = jasmine.createSpyObj("encryptionScheme", [
    "getCapabilities",
    "getName",
    "setComputation",
    "doScheme",
    "getBitLengths"
  ]);
  let computation = jasmine.createSpyObj("computation", [""]);

  beforeEach(() => {
    routeParams.get.and.returnValue("pailler");

    encryptionScheme.getCapabilities.and.returnValue(["+"]);
    let bitLength = new EncryptionSchemeBitLength(8, 99);
    encryptionScheme.getBitLengths.and.returnValue([bitLength]);

    encryptionSchemeProvider.getEncryptionSchemeByName.and.returnValue(encryptionScheme);

    computationProvider.create.and.returnValue(computation);

    computationRun = new ComputationRun(
      computationRunner,
      routeParams,
      formBuilder,
      encryptionSchemeProvider,
      computationProvider
    );
  });

  it("should initialise", () => {

    expect(formBuilder.group.calls.mostRecent().args)
      .toEqual([{
        "a": ["", Validators.required],
        "b": ["", Validators.required],
        "bitLengths": ["", Validators.required]
      }, {
        validator: jasmine.any(Function)
      }])
    ;

    expect(encryptionSchemeProvider.getEncryptionSchemeByName.calls.mostRecent().args)
      .toEqual(["pailler"])
    ;

    expect(computationProvider.create.calls.mostRecent().args)
      .toEqual([encryptionScheme])
    ;

    expect(routeParams.get.calls.mostRecent().args)
      .toEqual(["type"])
    ;

  });

  it("should submit", () => {
    let event = jasmine.createSpyObj("event", ["preventDefault"]);

    computationRun.submit(event);

    expect(event.preventDefault)
      .toHaveBeenCalled()
    ;

    expect(computationRunner.setComputation.calls.mostRecent().args)
      .toEqual([computation])
    ;

    expect(computationRunner.runComputation)
      .toHaveBeenCalled()
    ;

  });

});