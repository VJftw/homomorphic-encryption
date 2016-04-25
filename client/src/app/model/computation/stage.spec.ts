import {
    it
} from 'angular2/testing';

import {Stage} from './stage';

describe('computation-stage-model', () => {

    let stage: Stage;

    beforeEach(() => {
        stage = new Stage();
    });

    it('should return the encryption stage', () => {
        expect(stage.getEncryptionStage())
            .toBeUndefined()
            ;
    });

    it('should set the encryption stage', () => {
        let encryptionStage = jasmine.createSpyObj('encryptionStage', ['']);

        expect(stage.setEncryptionStage(encryptionStage))
            .toBe(stage)
            ;

        expect(stage.getEncryptionStage())
            .toBe(encryptionStage)
            ;
    });

    it('should return the steps', () => {
        expect(stage.getSteps())
            .toEqual([])
            ;
    });

    it('should add a step', () => {
        let step = jasmine.createSpyObj('step', ['']);

        expect(stage.addStep(step))
            .toBe(stage)
            ;

        expect(stage.getSteps())
            .toEqual([
                step
            ]);
    });

});
