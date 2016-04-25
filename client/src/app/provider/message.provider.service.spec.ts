import {
    it
} from 'angular2/testing';

import {MessageProviderService} from './message.provider.service';


describe('message-provider', () => {

    let messageProviderService: MessageProviderService;

    beforeEach(() => {
        messageProviderService = new MessageProviderService();
    });

    it('should create a register message', () => {
        let computation = jasmine.createSpyObj('computation', ['getEncryptionScheme']);
        let encryptionScheme = jasmine.createSpyObj('encryptionScheme', ['getUniqueName']);
        encryptionScheme.getUniqueName.and.returnValue('pailler');
        computation.getEncryptionScheme.and.returnValue(encryptionScheme);

        expect(messageProviderService.createRegisterMessage(computation).toJson())
            .toEqual({
                'encryptionScheme': 'pailler'
            })
        ;

    });

    it('should create a compute message', () => {
        let computation = jasmine.createSpyObj('computation', [
            'getPublicScope',
            'getEncryptionScheme',
            'getHashId',
            'getAuthToken',
            'getOperation'
        ]);

        computation.getPublicScope.and.returnValue({
            'a': '33'
        });

        let encryptionScheme = jasmine.createSpyObj('encryptionScheme', ['getBackendStageByOperation']);
        let backendStage = jasmine.createSpyObj('backendStage', ['getSteps']);
        backendStage.getSteps.and.returnValue([]);
        encryptionScheme.getBackendStageByOperation.and.returnValue(backendStage);
        computation.getEncryptionScheme.and.returnValue(encryptionScheme);

        computation.getHashId.and.returnValue('abcdef');
        computation.getAuthToken.and.returnValue('xczv');
        computation.getOperation.and.returnValue('+');

        let computeMessage = messageProviderService.createComputeMessage(computation);

        expect(computeMessage.toJson())
            .toEqual({
                'action': 'computation/compute',
                'data': {
                    'hashId': 'abcdef',
                    'authToken': 'xczv',
                    'computeSteps': [],
                    'publicScope': {
                        'a': '33'
                    }
                }
            })
        ;
    });

});
