import {
  it
} from "angular2/testing";

import {StageResolver} from "./stage_resolver";

describe("StageResolver", () => {

  let stepResolver = jasmine.createSpyObj("stepResolver", ["fromJson"]);

  let stageResolver: StageResolver;

  beforeEach(() => {
    stepResolver.fromJson.and.returnValue("STEP");

    stageResolver = new StageResolver(
      stepResolver
    );
  });

  it("should resolve a Stage from JSON", () => {
    let json = {
      "name": "Workspace",
      "steps": ["aaaa"]
    };

    let stage = stageResolver.fromJson(json);

    expect(stage.getName())
      .toBe("Workspace")
    ;

    expect(stage.getSteps())
      .toEqual(["STEP"])
    ;

  });


});