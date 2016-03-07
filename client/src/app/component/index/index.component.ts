/*
 * Angular 2
 */
import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';


// Simple external file component example
@Component({
  selector: 'home'
})
@View({
  directives: [
    // Angular's core directives
    CORE_DIRECTIVES,

    // Angular's router
    ROUTER_DIRECTIVES,
  ],
  // include our .html and .css file
  template: require('./index.html')
})
export class Index {
}