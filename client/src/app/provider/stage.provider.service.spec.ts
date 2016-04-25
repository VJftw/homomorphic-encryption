import {
    it
} from 'angular2/testing';
import {StageProviderService} from './stage.provider.service';

describe('stage-provider', () => {

    let stepProviderService = jasmine.createSpyObj('stepProviderService', ['create']);
    let step = jasmine.createSpyObj('step', ['']);
    stepProviderService.create.and.returnValue(step);

    let stageProviderService: StageProviderService;

    beforeEach(() => {
        stageProviderService = new StageProviderService(
            stepProviderService
        );
    });

    it('should return a stage from an scheme stage', () => {
        let schemeStage = jasmine.createSpyObj('schemeStage', ['getSteps']);
        let schemeStep = jasmine.createSpyObj('schemeStep', ['']);
        schemeStage.getSteps.and.returnValue([schemeStep]);

        let stage = stageProviderService.createFromEncryptionStage(schemeStage);

        expect(stage.getEncryptionStage())
            .toBe(schemeStage)
        ;

        expect(stage.getSteps())
            .toEqual([step])
        ;
    });
});
