import {
    it
} from 'angular2/testing';

import {FormBuilder, Validators} from 'angular2/common';
import {RouteParams} from 'angular2/router';

import {ComputationRunComponent} from './run.component';
import {BitLength} from '../../model/encryption-scheme/bit-length';


describe('computation-run component', () => {

    let routeParams = jasmine.createSpyObj('routeParams', ['get']);
    let formBuilder = jasmine.createSpyObj('formBuilder', ['group']);
    let computationRunner = jasmine.createSpyObj('computationRunner', ['setComputation', 'runComputation']);
    let encryptionSchemeProviderService = jasmine.createSpyObj(
        'encryptionSchemeProviderService', ['getEncryptionSchemeByName']
    );
    let computationProviderService = jasmine.createSpyObj('computationProviderService', ['create']);

    let computationRun: ComputationRunComponent;

    let encryptionScheme = jasmine.createSpyObj('encryptionScheme', [
        'getCapabilities',
        'getName',
        'setComputation',
        'doScheme',
        'getBitLengths'
    ]);
    let computation = jasmine.createSpyObj('computation', ['']);

    beforeEach(() => {
        routeParams.get.and.returnValue('pailler');

        encryptionScheme.getCapabilities.and.returnValue(['+']);
        let bitLength = new BitLength(8, 99);
        encryptionScheme.getBitLengths.and.returnValue([bitLength]);

        encryptionSchemeProviderService.getEncryptionSchemeByName.and.returnValue(encryptionScheme);

        computationProviderService.create.and.returnValue(computation);

        computationRun = new ComputationRunComponent(
            routeParams,
            formBuilder,
            computationRunner,
            encryptionSchemeProviderService,
            computationProviderService
        );

        computationRun.ngOnInit();
    });

    it('should initialise', () => {

        expect(formBuilder.group.calls.mostRecent().args)
            .toEqual([{
                'a': ['', Validators.required],
                'b': ['', Validators.required],
                'bitLengths': ['', Validators.required]
            }, {
                    validator: jasmine.any(Function)
                }])
            ;

        expect(encryptionSchemeProviderService.getEncryptionSchemeByName.calls.mostRecent().args)
            .toEqual(['pailler'])
        ;

        expect(computationProviderService.create.calls.mostRecent().args)
            .toEqual([encryptionScheme])
        ;

        expect(routeParams.get.calls.mostRecent().args)
            .toEqual(['type'])
        ;

    });

    it('should submit', () => {
        let event = jasmine.createSpyObj('event', ['preventDefault']);

        computationRun.submit(event);

        expect(event.preventDefault)
            .toHaveBeenCalled()
        ;

        expect(computationRunner.setComputation.calls.mostRecent().args)
            .toEqual([computation])
        ;

        expect(computationRunner.runComputation)
            .toHaveBeenCalled()
        ;

    });

});
