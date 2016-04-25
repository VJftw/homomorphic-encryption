import {
    it
} from 'angular2/testing';

import {EncryptionSchemeResolverService} from '../resolver/encryption-scheme.resolver.service';
import {EncryptionSchemeProviderService} from './encryption-scheme.provider.service';


describe('encryption-scheme-provider', () => {

    let encryptionSchemeResolverService = jasmine.createSpyObj('encryptionSchemeResolverService', ['fromJson']);
    let encryptionScheme = jasmine.createSpyObj('encryptionScheme', [
        'getUniqueName'
    ]);
    encryptionScheme.getUniqueName.and.returnValue('pailler');
    encryptionSchemeResolverService.fromJson.and.returnValue(encryptionScheme);

    let encryptionSchemeProviderService: EncryptionSchemeProviderService;

    beforeEach(() => {
        encryptionSchemeProviderService = new EncryptionSchemeProviderService(
            encryptionSchemeResolverService
        );
    });

    it('should return an encryption scheme given by its name', () => {

        expect(encryptionSchemeProviderService.getEncryptionSchemeByName('pailler'))
            .toBe(encryptionScheme)
        ;

    });

    it('should throw an error for an unknown encryption encryption-scheme', () => {

        expect(() => {
            encryptionSchemeProviderService.getEncryptionSchemeByName('abcd');
        }).toThrowError()
        ;

    });

    it('should return the encryption schemes', () => {

        let schemes = encryptionSchemeProviderService.getEncryptionSchemes();

        expect(schemes.length)
            .toBe(1)
        ;

    });
});
