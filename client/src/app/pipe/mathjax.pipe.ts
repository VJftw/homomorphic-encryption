import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({ name: 'mathjax' })
export class MathjaxPipe implements PipeTransform {

    transform(value: string, args: string[]): any {

        switch (value) {
            case 'x':
                return '\\times';
            default:
                return value;
        }
    }

}
