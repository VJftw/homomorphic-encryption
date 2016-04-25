import {
    it
} from 'angular2/testing';

import {EncryptionSchemeResolverService} from './encryption-scheme.resolver.service';

describe('encryption-scheme-resolver', () => {

    let bitLengthResolverService = jasmine.createSpyObj('bitLengthResolverService', ['fromJson']);
    let bitLength = jasmine.createSpyObj('bitLength', ['']);
    bitLengthResolverService.fromJson.and.returnValue(bitLength);
    let stageResolverService = jasmine.createSpyObj('stageResolverService', ['fromJson']);
    let stage = jasmine.createSpyObj('stage', ['']);
    stageResolverService.fromJson.and.returnValue(stage);

    let encryptionSchemeResolverService: EncryptionSchemeResolverService;

    beforeEach(() => {
        encryptionSchemeResolverService = new EncryptionSchemeResolverService(
            bitLengthResolverService,
            stageResolverService
        );
    });

    it('should resolve an encryption scheme', () => {
        let schemeJson = {
            'uniqueName': 'pailler',
            'readableName': 'Pailler',
            'description': 'An additive homomorphic cryptosystem created by Pascal Pailler in 1999.',
            'bitLengths': [
                {
                    'bitLength': 8,
                    'maxInt': 99
                }
            ],
            'stages': {
                'setup': [
                    {
                        'name': 'Key Generation',
                        'preDescription': 'This phase sets up the keys.',
                        'steps': [
                            {
                                'description': 'A random prime number',
                                'compute': 'p = generateRandomPrime()'
                            }
                        ],
                        'postDescription': ''
                    }
                ],
                'encryption': [
                    {
                        'name': 'Encryption',
                        'preDescription': '',
                        'steps': [
                            {
                                'description': '\\(n^2\\)',
                                'compute': 'nSq = n * n',
                                'expose': true
                            }
                        ],
                        'postDescription': ''
                    }
                ],
                'backend': {
                    '+': {
                        'name': 'Addition',
                        'preDescription': '',
                        'steps': [
                            {
                                'description': '\\(aX \\times bX \\bmod n^2\\)',
                                'compute': 'cX = (aX * bX) % nSq'
                            }
                        ],
                        'postDescription': ''
                    }
                },
                'decryption': [
                    {
                        'name': 'Decryption',
                        'preDescription': '',
                        'steps': [
                            {
                                'description': '\\(cX^l \\bmod n^2\\)',
                                'compute': 'u = cX & l,nSq'
                            },
                            {
                                'description': '\\(\\frac{u - 1}{n}\\)',
                                'compute': 'v = (u - 1) / n'
                            },
                            {
                                'description': '\\( v \\times m \\bmod n \\)',
                                'compute': 'c = ((u / n) * m) % n'
                            }
                        ],
                        'postDescription': ''
                    }
                ]
            }
        };

        let scheme = encryptionSchemeResolverService.fromJson(schemeJson);
    });

});
