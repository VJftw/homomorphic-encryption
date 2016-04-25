import {
    it
} from 'angular2/testing';

import {FormBuilder, Validators} from 'angular2/common';
import {RouteParams} from 'angular2/router';

import {ComputationComponent} from './computation.component';
import {BitLength} from '../../model/encryption-scheme/bit-length';


describe('computation-component', () => {

    let computationComponent: ComputationComponent;

    beforeEach(() => {
        computationComponent = new ComputationComponent();
    });

    it('should initialise', () => {
        expect(computationComponent)
            .toBeDefined()
        ;
    });

});
