import {
  it
} from 'angular2/testing';

import {Step} from './step';


describe('Step', () => {

  it('should default to the private scope', () => {

    let step = new Step(
      'desc',
      'compute'
    );

    expect(step.isPublicScope())
      .toEqual(false)
    ;

  });

  it('should set the public scope when given', () => {

    let step = new Step(
      'desc',
      'compute',
      true
    );

    expect(step.isPublicScope())
      .toEqual(true)
    ;

  });

  it('should return the description', () => {
    let step = new Step('desc', 'compute');

    expect(step.getDescription())
      .toEqual('desc')
    ;
  });

  it('should return the compute', () => {
    let step = new Step('desc', 'compute');

    expect(step.getCompute())
      .toEqual('compute')
    ;
  });

  it('should serialize to JSON', () => {
    let step = new Step('desc', 'compute');

    expect(step.toJson())
      .toEqual({
        'description': 'desc',
        'compute': 'compute'
      });

  });

});
