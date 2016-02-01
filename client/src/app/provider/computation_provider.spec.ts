import {
  it
} from "angular2/testing";

import {ComputationProvider} from "./computation_provider";

describe("ComputationProvider", () => {

  let computationProvider: ComputationProvider;

  beforeEach(() => {
    computationProvider = new ComputationProvider();
  });

  it("should create new Computation with the given Encryption Scheme", () => {

    let scheme = jasmine.createSpyObj("scheme", ["getName", "getCapabilities"]);
    scheme.getCapabilities.and.returnValue(["+"]);

    let computation = computationProvider.create(scheme);

    expect(computation.getEncryptionScheme())
      .toBe(scheme)
    ;

    expect(computation.getOperation())
      .toBe("+")
    ;
  });

});