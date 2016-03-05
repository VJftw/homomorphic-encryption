import {
  it
} from 'angular2/testing';

import {StepProvider} from './step_provider';
import {BigInteger} from 'jsbn';

describe('StepProvider', () => {

  let stepProvider: StepProvider;

  beforeEach(() => {
    stepProvider = new StepProvider();
  });

  it('should return a step with the given parameters', () => {
    let step = stepProvider.create('aaaa', new BigInteger('3'));

    expect(step.getAction())
      .toEqual('aaaa')
    ;

    expect(step.getResult().toString())
      .toEqual('3')
    ;

    expect(step.getTimestamp())
      .toBeDefined()
    ;
  });
});