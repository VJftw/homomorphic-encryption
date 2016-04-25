import {
    it
} from 'angular2/testing';
import {ComputationProviderService} from './computation.provider.service';


describe('computation-provider', () => {

    let stageProviderService = jasmine.createSpyObj('stageProviderService', [
        'createFromEncryptionStage',
    ]);

    let computationProvider: ComputationProviderService;

    beforeEach(() => {
        computationProvider = new ComputationProviderService(
            stageProviderService
        );
    });

    it('should create new Computation with the given Encryption Scheme', () => {

        let schemeStage = jasmine.createSpyObj('schemeStage', ['']);
        let stage = jasmine.createSpyObj('stage', ['']);
        stageProviderService.createFromEncryptionStage.and.returnValue(stage);

        let scheme = jasmine.createSpyObj('scheme', [
            'getName',
            'getCapabilities',
            'getBitLengths',
            'getSetupStages',
            'getEncryptionStages',
            'getBackendStages',
            'getDecryptionStages'
        ]);
        scheme.getCapabilities.and.returnValue(['+']);
        scheme.getSetupStages.and.returnValue([schemeStage]);
        scheme.getEncryptionStages.and.returnValue([schemeStage]);
        scheme.getBackendStages.and.returnValue(new Map().set('+', schemeStage));
        scheme.getDecryptionStages.and.returnValue([schemeStage]);
        let bitLength = jasmine.createSpyObj('bitLength', ['getBitLength']);
        bitLength.getBitLength.and.returnValue(8);
        scheme.getBitLengths.and.returnValue([bitLength]);

        let computation = computationProvider.create(scheme);

        expect(computation.getEncryptionScheme())
            .toBe(scheme)
        ;

        expect(computation.getOperation())
            .toBe('+')
        ;

        expect(computation.getBitLength())
            .toBe(8)
        ;

        expect(computation.getSetupStages())
            .toEqual([stage])
        ;

        expect(computation.getEncryptionStages())
            .toEqual([stage])
        ;

        computation.setOperation('+');
        expect(computation.getBackendStage())
            .toEqual(stage)
        ;

        expect(computation.getDecryptionStages())
            .toEqual([stage])
        ;
    });

});
