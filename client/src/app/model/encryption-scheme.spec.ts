import {
    it
} from 'angular2/testing';

import {EncryptionScheme} from './encryption-scheme';
import {Stage} from './encryption-scheme/stage';


describe('encryption-scheme-model', () => {

    let encryptionScheme: EncryptionScheme;

    beforeEach(() => {
        encryptionScheme = new EncryptionScheme(
            'pailler',
            'Pailler',
            'The Pailler additive hc'
        );
    });

    it('should return the Unique Name', () => {
        expect(encryptionScheme.getUniqueName())
            .toEqual('pailler')
            ;
    });

    it('should return the Readable Name', () => {
        expect(encryptionScheme.getReadableName())
            .toEqual('Pailler')
            ;
    });

    it('should return the description', () => {
        expect(encryptionScheme.getDescription())
            .toEqual('The Pailler additive hc')
            ;
    });

    it('should return the capabilities', () => {
        expect(encryptionScheme.getCapabilities())
            .toEqual([])
            ;

        let stage = jasmine.createSpyObj('stage', ['']);
        encryptionScheme.addBackendStage('+', stage);

        expect(encryptionScheme.getCapabilities())
            .toEqual(['+'])
            ;
    });

    it('should return the Bit Lengths', () => {
        expect(encryptionScheme.getBitLengths())
            .toEqual([])
            ;
    });

    it('should add a Bit Length', () => {
        let bitLength = jasmine.createSpyObj('bitLength', ['']);
        expect(encryptionScheme.addBitLength(bitLength))
            .toEqual(encryptionScheme)
            ;

        expect(encryptionScheme.getBitLengths())
            .toEqual([bitLength])
            ;
    });

    it('should return a given bit length', () => {
        let bitLength = jasmine.createSpyObj('bitLength', ['getBitLength']);
        bitLength.getBitLength.and.returnValue(8);

        encryptionScheme.addBitLength(bitLength);

        expect(encryptionScheme.getBitLength(8))
            .toEqual(bitLength)
            ;
    });

    it('should throw an error for a missing bit length', () => {
        expect(() => {
            encryptionScheme.getBitLength(9);
        }).toThrowError()
            ;
    });

    it('should return the setup stages', () => {
        expect(encryptionScheme.getSetupStages())
            .toEqual([])
            ;
    });

    it('should add a setup stage', () => {
        let stage = jasmine.createSpyObj('stage', ['']);

        expect(encryptionScheme.addSetupStage(stage))
            .toEqual(encryptionScheme)
            ;

        expect(encryptionScheme.getSetupStages())
            .toEqual([stage])
            ;
    });

    it('should return the encryption stages', () => {
        expect(encryptionScheme.getEncryptionStages())
            .toEqual([])
            ;
    });

    it('should add an encryption stage', () => {
        let stage = jasmine.createSpyObj('stage', ['']);

        expect(encryptionScheme.addEncryptionStage(stage))
            .toEqual(encryptionScheme)
            ;

        expect(encryptionScheme.getEncryptionStages())
            .toEqual([stage])
            ;
    });

    it('should return the decryption stages', () => {
        expect(encryptionScheme.getDecryptionStages())
            .toEqual([])
            ;
    });

    it('should add a decryption stage', () => {
        let stage = jasmine.createSpyObj('stage', ['']);

        expect(encryptionScheme.addDecryptionStage(stage))
            .toEqual(encryptionScheme)
            ;

        expect(encryptionScheme.getDecryptionStages())
            .toEqual([stage])
            ;
    });

    it('should return the backend stages', () => {
        expect(encryptionScheme.getBackendStages())
            .toEqual(new Map<string, Stage>())
            ;
    });

    it('should add a backend stage', () => {
        let stage = jasmine.createSpyObj('stage', ['']);

        expect(encryptionScheme.addBackendStage('+', stage))
            .toEqual(encryptionScheme)
            ;

        let m = new Map<string, Stage>();
        m.set('+', stage);

        expect(encryptionScheme.getBackendStages())
            .toEqual(m);
    });

    it('should return the backend stage by operation', () => {
        let stage = jasmine.createSpyObj('stage', ['']);
        encryptionScheme.addBackendStage('+', stage);

        expect(encryptionScheme.getBackendStageByOperation('+'))
            .toEqual(stage)
            ;
    });

    it('should throw an error for a missing backend stage', () => {
        expect(() => {
            encryptionScheme.getBackendStageByOperation('*');
        }).toThrowError()
            ;
    });


});
