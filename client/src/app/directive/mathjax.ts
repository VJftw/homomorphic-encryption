import {Directive, ViewContainerRef, TemplateRef} from 'angular2/core';


@Directive({inputs: ['mathjax'], selector: '[mathjax]' })
export class MathJaxDirective {

  constructor(
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef
  ) { }

  set mathjax(x) {
    this._viewContainer.createEmbeddedView(this._templateRef);
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
}
