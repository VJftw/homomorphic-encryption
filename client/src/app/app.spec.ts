import {
  it,
  inject,
  injectAsync,
  beforeEachProviders
} from "angular2/testing";

// Load the implementations that should be tested
import {App} from "./app";
// import {Title} from "./providers/title";

describe("App", () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App,
    // Title
  ]);

  it("should have a title", inject([ App ], (app) => {
    expect(app.title).toEqual("An Implementation of Homomorphic Encryption");
  }));

  // it("should have Title service", inject([ App ], (app) => {
  //  expect(!!app.title).toEqual(true);
  // }));

});