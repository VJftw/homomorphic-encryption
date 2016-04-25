import {
    it
} from 'angular2/testing';

import {Step} from './step';

describe('computation-step-model', () => {

    let step: Step;

    beforeEach(() => {
        step = new Step();
    });

    it('should return the encryption step', () => {
        expect(step.getEncryptionStep())
            .toBeUndefined()
            ;
    });

    it('should set the encryption step', () => {
        let encryptionStep = jasmine.createSpyObj('encryptionStep', ['']);

        expect(step.setEncryptionStep(encryptionStep))
            .toBe(step)
            ;

        expect(step.getEncryptionStep())
            .toBe(encryptionStep)
            ;
    });

    it('should return the variable', () => {
        expect(step.getVariable())
            .toBeUndefined()
            ;
    });

    it('should set the variable', () => {
        expect(step.setVariable('f'))
            .toBe(step)
            ;

        expect(step.getVariable())
            .toEqual('f')
            ;
    });

    it('should return the calculation', () => {
        expect(step.getCalculation())
            .toBeUndefined()
            ;
    });

    it('should set the calculation', () => {
        expect(step.setCalculation('calc'))
            .toBe(step)
            ;

        expect(step.getCalculation())
            .toEqual('calc')
            ;
    });

    it('should return the result', () => {
        expect(step.getResult())
            .toBeUndefined()
            ;
    });

    it('should set the result', () => {
        let result = jasmine.createSpyObj('result', ['']);

        expect(step.setResult(result))
            .toBe(step)
            ;

        expect(step.getResult())
            .toBe(result)
            ;
    });

});
