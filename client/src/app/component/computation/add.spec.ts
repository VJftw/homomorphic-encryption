import {
  it
} from "angular2/testing";

import {ComputationAdd} from "./add";


describe("ComputationAdd", () => {

  let computationAdd: ComputationAdd;
  let formBuilder: any;
  let encryptionSchemeProvider: any;

  beforeEach(() => {
    formBuilder = jasmine.createSpyObj("formBuilder", ["group"]);
    encryptionSchemeProvider = jasmine.createSpyObj("encryptionSchemeProvider", ["getEncryptionSchemeByName"]);

    formBuilder.group.and.returnValue({});

    computationAdd = new ComputationAdd(
      formBuilder,
      encryptionSchemeProvider
    );
  });

  it("should set the encryption scheme", () => {
    let paillerScheme = jasmine.createSpyObj("paillerScheme", ["setComputation", "getCapabilities", "doScheme"]);
    paillerScheme.setComputation.and.returnValue(paillerScheme);
    paillerScheme.getCapabilities.and.returnValue(["+"]);
    encryptionSchemeProvider.getEncryptionSchemeByName.and.returnValue(paillerScheme);

    expect(computationAdd.setEncryptionScheme("Pailler"))
      .toBe(computationAdd)
    ;

    expect(paillerScheme.getCapabilities).toHaveBeenCalled();
  });

  it("should submit the computation", () => {
    let event = jasmine.createSpyObj("event", ["preventDefault"]);
    let paillerScheme = jasmine.createSpyObj("paillerScheme", ["setComputation", "getCapabilities", "doScheme"]);
    paillerScheme.setComputation.and.returnValue(paillerScheme);
    paillerScheme.getCapabilities.and.returnValue(["+"]);
    encryptionSchemeProvider.getEncryptionSchemeByName.and.returnValue(paillerScheme);

    computationAdd.setEncryptionScheme(paillerScheme);
    computationAdd.submit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(paillerScheme.setComputation).toHaveBeenCalled();
  });



});