import {
    it
} from 'angular2/testing';

import {BigInteger} from 'jsbn';
import {StepProviderService} from './step.provider.service';

describe('step-provider', () => {

    let stepProviderService: StepProviderService;

    beforeEach(() => {
        stepProviderService = new StepProviderService();
    });

    it('should return a step from the given scheme step', () => {
        let schemeStep = jasmine.createSpyObj('schemeStep', ['getCompute']);
        schemeStep.getCompute.and.returnValue('a = 5 + 3');

        let step = stepProviderService.create(schemeStep);

        expect(step.getEncryptionStep())
            .toBe(schemeStep)
        ;

        expect(step.getVariable())
            .toEqual('a')
        ;

        expect(step.getCalculation())
            .toEqual('5 + 3')
        ;
    });
});
