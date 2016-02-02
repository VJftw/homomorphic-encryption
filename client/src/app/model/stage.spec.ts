import {
  it
} from "angular2/testing";

import {Stage} from "./stage";

describe("Stage", () => {

  let stage: Stage;

  beforeEach(() => {
    stage = new Stage();
  });

  it("should return the name", () => {
    expect(stage.getName())
      .toBeUndefined()
    ;
  });

  it("should set the name", () => {
    expect(stage.setName("abcdef"))
      .toBe(stage)
    ;

    expect(stage.getName())
      .toEqual("abcdef")
    ;
  });

  it("should return the host", () => {
    expect(stage.getHost())
      .toBeUndefined()
    ;
  });

  it("should set the host", () => {
    expect(stage.setHost(Stage.HOST_CLIENT))
      .toBe(stage)
    ;

    expect(stage.getHost())
      .toBe(Stage.HOST_CLIENT)
    ;
  });

  it("should return the steps", () => {
    expect(stage.getSteps())
      .toEqual([])
    ;
  });

  it("should add a step", () => {
    let step = jasmine.createSpyObj("step", [""]);

    expect(stage.addStep(step))
      .toBe(stage)
    ;

    expect(stage.getSteps())
      .toEqual([step])
    ;
  });

});
