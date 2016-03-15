import {
  it,
  inject,
  injectAsync,
  beforeEachProviders,
  TestComponentBuilder
} from 'angular2/testing';

// Load the implementations that should be tested
import {App} from './app';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App
  ]);
  it('should have a title', inject([ App ], (app) => {
    
    console.log(app.title);

    expect(app.title).toEqual('Implementations of Homomorphic Encryption');

  }));

  // it('should have Title service', inject([ App ], (app) => {
  //  expect(!!app.title).toEqual(true);
  // }));

});
