import {
    it
} from 'angular2/testing';

import {Computation} from './computation';
import {BigInteger} from 'jsbn';

describe('computation-model', () => {

    let computation: Computation;

    beforeEach(() => {
        computation = new Computation();
    });

    it('should return the hashId', () => {
        expect(computation.getHashId())
            .toBeUndefined()
            ;
    });

    it('should set the hashId', () => {
        expect(computation.setHashId('ax54dc'))
            .toBe(computation)
            ;

        expect(computation.getHashId())
            .toEqual('ax54dc')
            ;
    });

    it('should return A', () => {
        expect(computation.getA())
            .toBeUndefined()
            ;
    });

    it('should return B', () => {
        expect(computation.getB())
            .toBeUndefined()
            ;
    });

    it('should return C', () => {
        expect(computation.getC())
            .toBeUndefined()
            ;
    });

    it('should set C', () => {
        let c = jasmine.createSpyObj('c', ['']);
        expect(computation.setC(c))
            .toBe(computation)
            ;

        expect(computation.getC())
            .toBe(c)
            ;
    });

    it('should return the timestamp', () => {
        expect(computation.getTimestamp())
            .toBeUndefined()
            ;
    });

    it('should set the timestamp', () => {
        let timestamp = new Date();
        expect(computation.setTimestamp(timestamp))
            .toBe(computation)
            ;

        expect(computation.getTimestamp())
            .toBe(timestamp)
            ;
    });

    it('should return the bit length', () => {
        expect(computation.getBitLength())
            .toBeUndefined()
            ;
    });

    it('should set the bit length', () => {
        expect(computation.setBitLength(16))
            .toEqual(computation)
            ;

        expect(computation.getBitLength())
            .toEqual(16)
            ;
    });

    it('should return the operation', () => {
        expect(computation.getOperation())
            .toBeUndefined()
            ;
    });

    it('should set the operation', () => {
        expect(computation.setOperation('+'))
            .toBe(computation)
            ;

        expect(computation.getOperation())
            .toEqual('+')
            ;
    });

    it('should return the auth token', () => {
        expect(computation.getAuthToken())
            .toBeUndefined()
            ;
    });

    it('should set the auth token', () => {
        expect(computation.setAuthToken('abcdef'))
            .toBe(computation)
            ;

        expect(computation.getAuthToken())
            .toEqual('abcdef')
            ;
    });

    it('should return the encryption scheme', () => {
        expect(computation.getEncryptionScheme())
            .toBeUndefined()
            ;
    });

    it('should set the encryption scheme', () => {
        let encryptionScheme = jasmine.createSpyObj('encryptionScheme', ['']);

        expect(computation.setEncryptionScheme(encryptionScheme))
            .toEqual(computation)
            ;

        expect(computation.getEncryptionScheme())
            .toEqual(encryptionScheme)
            ;
    });

    it('should return the initial state', () => {
        expect(computation.getState())
            .toEqual(Computation.STATE_NEW)
            ;
    });

    it('should set the state', () => {
        expect(computation.setState(Computation.STATE_STARTED))
            .toBe(computation)
            ;

        expect(computation.getState())
            .toEqual(Computation.STATE_STARTED)
            ;
    });

    it('should return whether or not it is in the NEW state', () => {
        expect(computation.isNew())
            .toEqual(true)
            ;

        expect(computation.isStarted())
            .toEqual(false)
            ;

        expect(computation.isComplete())
            .toEqual(false)
            ;
    });

    it('should return whether or not it is in the STARTED state', () => {
        computation.setState(Computation.STATE_STARTED);

        expect(computation.isNew())
            .toEqual(false)
            ;

        expect(computation.isStarted())
            .toEqual(true)
            ;

        expect(computation.isComplete())
            .toEqual(false)
            ;
    });

    it('should return whether or not it is in the COMPLETE state', () => {
        computation.setState(Computation.STATE_COMPLETE);

        expect(computation.isNew())
            .toEqual(false)
            ;

        expect(computation.isStarted())
            .toEqual(false)
            ;

        expect(computation.isComplete())
            .toEqual(true)
            ;
    });

    it('should return the stages', () => {
        expect(computation.getStages())
            .toEqual([])
            ;

        let setupStage = jasmine.createSpyObj('setupStage', ['']);
        computation.addSetupStage(setupStage);
        let encryptionStage = jasmine.createSpyObj('encryptionStage', ['']);
        computation.addEncryptionStage(encryptionStage);
        let backendStage = jasmine.createSpyObj('backendStage', ['']);
        computation.addBackendStage('+', backendStage);
        computation.setOperation('+');
        let decryptionStage = jasmine.createSpyObj('decryptionStage', ['']);
        computation.addDecryptionStage(decryptionStage);

        expect(computation.getStages())
            .toEqual([
                setupStage,
                encryptionStage,
                backendStage,
                decryptionStage
            ])
            ;
    });

    it('should return the setup stages', () => {
        expect(computation.getSetupStages())
            .toEqual([])
            ;
    });

    it('should add a setup stage', () => {
        let stage = jasmine.createSpyObj('setupStage', ['']);

        expect(computation.addSetupStage(stage))
            .toEqual(computation)
            ;

        expect(computation.getSetupStages())
            .toEqual([stage])
            ;
    });

    it('should return the encryption stages', () => {
        expect(computation.getEncryptionStages())
            .toEqual([])
            ;
    });

    it('should add a encryption stage', () => {
        let stage = jasmine.createSpyObj('encryptionStage', ['']);

        expect(computation.addEncryptionStage(stage))
            .toEqual(computation)
            ;

        expect(computation.getEncryptionStages())
            .toEqual([stage])
            ;
    });

    it('should return the backend stage', () => {
        expect(computation.getBackendStage())
            .toBeUndefined()
            ;
    });

    it('should add a backend stage', () => {
        let stage = jasmine.createSpyObj('backendAdditionStage', ['']);

        expect(computation.addBackendStage('+', stage))
            .toEqual(computation)
            ;

        computation.setOperation('+');

        expect(computation.getBackendStage())
            .toEqual(stage)
            ;
    });

    it('should return the decryption stages', () => {
        expect(computation.getDecryptionStages())
            .toEqual([])
            ;
    });

    it('should add a decryption stage', () => {
        let stage = jasmine.createSpyObj('decryptionStage', ['']);

        expect(computation.addDecryptionStage(stage))
            .toEqual(computation)
            ;

        expect(computation.getDecryptionStages())
            .toEqual([stage])
            ;
    });

    it('should return the public scope', () => {
        expect(computation.getPublicScope())
            .toEqual({})
            ;
    });

    it('should return the full scope', () => {
        let privateBigInt = jasmine.createSpyObj('BigInteger(4)', ['']);
        let publicBigInt = jasmine.createSpyObj('BigInteger(6)', ['']);
        computation.addToScope('a', privateBigInt);
        computation.addToScope('aX', publicBigInt, true);

        expect(computation.getFullScope())
            .toEqual({
                'a': privateBigInt,
                'aX': publicBigInt
            });

    });

    it('should return a value from the scope', () => {
        let privateBigInt = jasmine.createSpyObj('BigInteger(4)', ['']);
        let publicBigInt = jasmine.createSpyObj('BigInteger(6)', ['']);
        computation.addToScope('a', privateBigInt);
        computation.addToScope('aX', publicBigInt, true);

        expect(computation.getFromScope('a'))
            .toEqual(privateBigInt)
            ;

        expect(computation.getFromScope('aX'))
            .toEqual(publicBigInt)
            ;
    });

    it('should throw an exception if not in scope', () => {
        expect(() => {
            computation.getFromScope('d');
        }).toThrowError()
            ;
    });

});
