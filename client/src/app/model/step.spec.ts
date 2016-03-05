import {
  it
} from 'angular2/testing';

import {Step} from './step';
import {BigInteger} from 'jsbn';

describe('Step', () => {

  let step: Step;

  beforeEach(() => {
    step = new Step();
  });

  it('should return the action', () => {
    expect(step.getAction())
      .toBeUndefined()
    ;
  });

  it('should set the action', () => {
    expect(step.setAction('abcdef'))
      .toBe(step)
    ;

    expect(step.getAction())
      .toEqual('abcdef')
    ;
  });

  it('should return the result', () => {
    expect(step.getResult())
      .toBeUndefined()
    ;
  });

  it('should set the result', () => {
    let r = new BigInteger('1');

    expect(step.setResult(r))
      .toBe(step)
    ;

    expect(step.getResult())
      .toBe(r)
    ;
  });

  it('should return the timestamp', () => {
    expect(step.getTimestamp())
      .toBeUndefined()
    ;
  });

  it('should set the timestamp', () => {
    let d = new Date();

    expect(step.setTimestamp(d))
      .toBe(step)
    ;
  });

});
