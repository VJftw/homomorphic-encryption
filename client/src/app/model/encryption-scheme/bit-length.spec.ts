import {
  it
} from 'angular2/testing';

import {BitLength} from './bit-length';


describe('BitLength', () => {

  it('should be a new Bit Length with default max value', () => {
    let bitLength = new BitLength(8);

    expect(bitLength.getBitLength())
      .toEqual(8)
    ;

    expect(bitLength.getMaxInt())
      .toEqual(99)
    ;
  });

  it('should be a new Bit Length with given max value', () => {
    let bitLength = new BitLength(8, 300);

    expect(bitLength.getBitLength())
      .toEqual(8)
    ;

    expect(bitLength.getMaxInt())
      .toEqual(300)
    ;
  });

});
