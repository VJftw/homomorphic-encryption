import {
  it,
  inject,
  injectAsync,
  beforeEachProviders
} from "angular2/testing";

// Load the implementations that should be tested
import {ComputationIndex} from "./index";

describe("ComputationIndex", () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    ComputationIndex
  ]);

  it("should have the correct Schemes", inject([ ComputationIndex ], (app) => {
    expect(app.schemes).toEqual([
      'Pailler'
    ]);
  }));

});