import {Injectable} from 'angular2/core';

import {Computation} from '../model/computation';
import {EncryptionScheme} from '../model/encryption-scheme';
import {Stage} from '../model/computation/stage';
import {StageProviderService} from './stage.provider.service';


@Injectable()
export class ComputationProviderService {

    constructor(
        private _stageProviderService: StageProviderService
    ) { }

    public create(scheme: EncryptionScheme): Computation {
        let c = new Computation();

        c
            .setEncryptionScheme(scheme)
            .setOperation(scheme.getCapabilities()[0])
            .setBitLength(scheme.getBitLengths()[0].getBitLength())
        ;

        for (let encryptionStage of scheme.getSetupStages()) {
            let stage = this._stageProviderService.createFromEncryptionStage(encryptionStage);
            c.addSetupStage(stage);
        }

        for (let encryptionStage of scheme.getEncryptionStages()) {
            let stage = this._stageProviderService.createFromEncryptionStage(encryptionStage);
            c.addEncryptionStage(stage);
        }

        scheme.getBackendStages().forEach((value, key) => {
            let stage = this._stageProviderService.createFromEncryptionStage(value);
            c.addBackendStage(key, stage);
        });

        for (let encryptionStage of scheme.getDecryptionStages()) {
            let stage = this._stageProviderService.createFromEncryptionStage(encryptionStage);
            c.addDecryptionStage(stage);
        }

        return c;
    }

}
