import {
  it
} from "angular2/testing";

import {FormBuilder, Validators} from "angular2/common";
import {RouteParams} from "angular2/router";
import {EncryptionSchemeProvider} from "../../provider/encryption_scheme_provider";

import {ComputationRun} from "./run";


describe("ComputationRun", () => {

  let formBuilder = jasmine.createSpyObj("formBuilder", ["group"]);
  let routeParams = jasmine.createSpyObj("routeParams", ["get"]);
  let encryptionSchemeProvider = jasmine.createSpyObj("encryptionSchemeProvider", ["getEncryptionSchemeByName"]);
  let computationProvider = jasmine.createSpyObj("computationProvider", ["create"]);
  let computationRunner = jasmine.createSpyObj("computationRunner", ["setComputation", "runComputation"]);

  let computationRun: ComputationRun;

  let encryptionScheme = jasmine.createSpyObj("encryptionScheme", ["getCapabilities", "getName", "setComputation", "doScheme"]);
  let computation = jasmine.createSpyObj("computation", [""]);

  beforeEach(() => {
    routeParams.get.and.returnValue("pailler");

    encryptionScheme.getCapabilities.and.returnValue(["+"]);

    encryptionSchemeProvider.getEncryptionSchemeByName.and.returnValue(encryptionScheme);

    computationProvider.create.and.returnValue(computation);

    computationRun = new ComputationRun(
      routeParams,
      formBuilder,
      encryptionSchemeProvider,
      computationProvider,
      computationRunner
    );
  });

  it("should initialise", () => {

    expect(formBuilder.group.calls.mostRecent().args)
      .toEqual([{
        "a": ["", Validators.required],
        "b": ["", Validators.required]
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