import {Injectable} from 'angular2/core';

import {Stage} from '../model/computation/stage';
import * as EncryptionStage from '../model/encryption-scheme/stage';
import {StepProviderService} from './step.provider.service';

@Injectable()
export class StageProviderService {

    constructor(
        private _stepProviderService: StepProviderService
    ) { }

    /**
     *
     * @param encryptionStage
     * @returns {Stage}
     */
    public createFromEncryptionStage(encryptionStage: EncryptionStage.Stage): Stage {
        let stage = new Stage();

        stage
            .setEncryptionStage(encryptionStage)
        ;

        for (let encryptionStep of encryptionStage.getSteps()) {
            let step = this._stepProviderService.create(encryptionStep);
            stage.addStep(step);
        }

        return stage;
    }
}
