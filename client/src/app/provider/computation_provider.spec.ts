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

    let scheme = jasmine.createSpyObj("scheme", ["getName", "getCapabilities", "getBitLengths"]);
    scheme.getCapabilities.and.returnValue(["+"]);
    let bitLength = jasmine.createSpyObj("bitLength", ["getBitLength"]);
    bitLength.getBitLength.and.returnValue(8);
    scheme.getBitLengths.and.returnValue([bitLength]);

    let computation = computationProvider.create(scheme);

    expect(computation.getEncryptionScheme())
      .toBe(scheme)
    ;

    expect(computation.getOperation())
      .toBe("+")
    ;

    expect(computation.getBitLength())
      .toBe(8)
    ;
  });

});