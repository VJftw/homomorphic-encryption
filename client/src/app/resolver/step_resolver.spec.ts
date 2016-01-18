import {
  it
} from "angular2/testing";

import {StepResolver} from "./step_resolver";

describe("StepResolver", () => {

  let stepResolver: StepResolver;

  beforeEach(() => {
    stepResolver = new StepResolver();
  });

  it("should resolve a full Step from JSON", () => {
    let d = new Date();

    let json = {
      "action": "ACTION",
      "result": "123123",
      "timestamp": d.toString()
    };

    let step = stepResolver.fromJson(json);

    expect(step.getAction())
      .toBe("ACTION")
    ;

    expect(step.getResult().toString())
      .toBe("123123")
    ;

    expect(step.getTimestamp().toString())
      .toEqual(d.toString())
    ;

  });

  it("should resolve a partial Step from JSON", () => {
    let d = new Date();

    let json = {
      "action": "ACTION",
      "timestamp": d.toString()
    };

    let step = stepResolver.fromJson(json);

    expect(step.getAction())
      .toBe("ACTION")
    ;

    expect(step.getTimestamp().toString())
      .toEqual(d.toString())
    ;

  });

});