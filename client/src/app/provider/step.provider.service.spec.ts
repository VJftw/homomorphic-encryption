//import {
//  it
//} from 'angular2/testing';
//
//import {BigInteger} from 'jsbn';
//import {StepProviderService} from './step.provider.service';
//
//describe('StepProviderService', () => {
//
//  let stepProvider: StepProviderService;
//
//  beforeEach(() => {
//    stepProvider = new StepProviderService();
//  });
//
//  it('should return a step with the given parameters', () => {
//    let step = stepProvider.create('aaaa', new BigInteger('3'));
//
//    expect(step.getAction())
//      .toEqual('aaaa')
//    ;
//
//    expect(step.getResult().toString())
//      .toEqual('3')
//    ;
//
//    expect(step.getTimestamp())
//      .toBeDefined()
//    ;
//  });
//});
