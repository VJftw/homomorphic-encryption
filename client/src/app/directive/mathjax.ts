import {Directive, ViewContainerRef, TemplateRef} from 'angular2/core';
import {ElementRef} from "angular2/core";

@Directive({selector: '[mathjax]' })
export class MathJaxDirective {

  constructor(
  ) {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }

}
