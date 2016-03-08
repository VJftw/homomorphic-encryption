import {
  it
} from 'angular2/testing';

import {MathjaxPipe} from './mathjax.pipe';


describe('MathjaxPip', () => {

  it('should transform the x operator to \\times', () => {
    let pipe = new MathjaxPipe();

    expect(pipe.transform('x', []))
      .toEqual('\\times')
    ;

    expect(pipe.transform('+', []))
      .toEqual('+')
    ;
  });

  it('should leave valid operators intact', () => {
    let pipe = new MathjaxPipe();

    expect(pipe.transform('+', []))
      .toEqual('+')
    ;
  });

});
