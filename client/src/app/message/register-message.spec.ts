import {
    it
} from 'angular2/testing';

import {RegisterMessage} from './register-message';


describe('register-message', () => {

    it('it should serialize to JSON', () => {
        let encryptionScheme = jasmine.createSpyObj('encryptionScheme', ['getUniqueName']);
        encryptionScheme.getUniqueName.and.returnValue('pailler');

        let registerMessage = new RegisterMessage(encryptionScheme);

        expect(registerMessage.toJson())
            .toEqual({
                'encryptionScheme': 'pailler'
            })
            ;
    });

});
