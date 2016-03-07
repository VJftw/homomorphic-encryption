import {
  it
} from 'angular2/testing';
import {StepResolverService} from '../resolver/encryption-scheme/step.resolver.service';
import {StageResolverService} from '../resolver/encryption-scheme/stage.resolver.service';
import {BitLengthResolverService} from '../resolver/encryption-scheme/bit-length.resolver.service';
import {EncryptionSchemeResolverService} from '../resolver/encryption-scheme.resolver.service';
import {EncryptionSchemeProviderService} from './encryption-scheme.provider.service';


describe('EncryptionSchemeProvider', () => {

  let encryptionSchemeStepResolver = new StepResolverService();
  let encryptionSchemeStageResolver = new StageResolverService(encryptionSchemeStepResolver);
  let encryptionSchemeBitLengthResolver = new BitLengthResolverService();
  let encryptionSchemeResolver = new EncryptionSchemeResolverService(encryptionSchemeBitLengthResolver, encryptionSchemeStageResolver);

  let encryptionSchemeProvider: EncryptionSchemeProviderService;

  beforeEach(() => {
    encryptionSchemeProvider = new EncryptionSchemeProviderService(
      encryptionSchemeResolver
    );
  });

  it('should return an encryption scheme given by its name', () => {

    //expect(encryptionSchemeProvider.getEncryptionSchemeByName('pailler').getReadableName())
    //  .toBe('Pailler')
    //;

  });

  it('should throw an error for an unknown encryption encryption-scheme', () => {

    expect(() => {
      encryptionSchemeProvider.getEncryptionSchemeByName('abcd')
    }).toThrowError()
    ;

  });

  it('should return the encryption schemes', () => {

    //let schemes = encryptionSchemeProvider.getEncryptionSchemes();
    //
    //expect(schemes.length)
    //  .toBe(2)
    //;

  });
});