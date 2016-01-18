import {
  it
} from "angular2/testing";

import {ComputationResolver} from "./computation_resolver";

describe("ComputationResolver", () => {

  let stageResolver = jasmine.createSpyObj("stageResolver", ["fromJson"]);

  let computationResolver: ComputationResolver;

  beforeEach(() => {

    stageResolver.fromJson.and.returnValue("STAGE");

    computationResolver = new ComputationResolver(
      stageResolver
    );
  });

  it("should resolve a Computation from JSON", () => {
    let json = {
      "scheme": "Pailler",
      "operation": "+",
      "aEncrypted": "6",
      "bEncrypted": "8",
      "state": 1,
      "stages": ["aaa"]
    };

    let computation = computationResolver.fromJson(json);

    expect(computation.getScheme())
      .toBe("Pailler")
    ;

    expect(computation.getOperation())
      .toBe("+")
    ;

    expect(computation.getAEncrypted().toString())
      .toBe("6")
    ;

    expect(computation.getBEncrypted().toString())
      .toBe("8")
    ;

    expect(computation.getState())
      .toBe(1)
    ;

    expect(computation.getStages())
      .toEqual(["STAGE"])
    ;
  });

});