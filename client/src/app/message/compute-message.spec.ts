import {
  it
} from 'angular2/testing';

import {ComputeMessage} from './compute-message';


describe('ComputeMessage', () => {

  it('should serialize to JSON', () => {

    let step = jasmine.createSpyObj('step', ['getCompute']);
    step.getCompute.and.returnValue('3 + 4');

    let computeMessage = new ComputeMessage(
      'abcdef',
      'zxcvb',
      [step],
      {
        'p': '4'
      }
    );

    expect(computeMessage.toJson())
      .toEqual({
        'action': 'computation/compute',
        'data': {
          'hashId': 'abcdef',
          'authToken': 'zxcvb',
          'computeSteps': ['3 + 4'],
          'publicScope': {
            'p': '4'
          }
        }
      });

  });

});
