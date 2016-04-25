import {Step} from './step';
import * as EncryptionStage from '../encryption-scheme/stage';

export class Stage {

    public static PHASE_SETUP = 0;
    public static PHASE_ENCRYPTION = 1;
    public static PHASE_BACKEND = 2;
    public static PHASE_DECRYPTION = 3;

    private _encryptionStage: EncryptionStage.Stage;

    private _steps: Step[];

    constructor() {
        this._steps = [];
    }

    public getEncryptionStage() {
        return this._encryptionStage;
    }

    public setEncryptionStage(encryptionStage: EncryptionStage.Stage) {
        this._encryptionStage = encryptionStage;

        return this;
    }

    /**
     * Returns the Steps
     * @returns {Array<Step>}
     */
    public getSteps(): Step[] {
        return this._steps;
    }

    /**
     * Adds a Step
     * @param step
     * @returns {Stage}
     */
    public addStep(step: Step): Stage {
        this._steps.push(step);

        return this;
    }

}
