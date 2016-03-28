/*
 * Angular 2
 */
import {Component} from 'angular2/core';
import {RouterLink} from 'angular2/router';

// Simple external file component example
@Component({
  selector: 'home',
  directives: [RouterLink],
  // include our .html and .css file
  template: require('./index.html')
})
export class Index {
}
