import {Directive, ElementRef} from 'angular2/core';

@Directive({selector: '[mathjax]' })
export class MathJaxDirective {

  constructor(
  ) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }

}
