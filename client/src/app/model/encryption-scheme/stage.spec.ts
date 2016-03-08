import {
  it
} from 'angular2/testing';

import {Stage} from './stage';


describe('Stage', () => {

  let stage: Stage;

  beforeEach(() => {
    stage = new Stage('Key Generation');
  });

  it('should return the name', () => {
    expect(stage.getName())
      .toEqual('Key Generation')
    ;
  });

  it('should return the pre description', () => {
    expect(stage.getPreDescription())
      .toBeUndefined()
    ;
  });

  it('should set the pre description', () => {

    expect(stage.setPreDescription('hello'))
      .toBe(stage)
    ;

    expect(stage.getPreDescription())
      .toEqual('hello')
    ;

  });

  it('should return the post description', () => {
    expect(stage.getPostDescription())
      .toBeUndefined()
    ;
  });

  it('should set the post description', () => {
    expect(stage.setPostDescription('postDesc'))
      .toBe(stage)
    ;

    expect(stage.getPostDescription())
      .toEqual('postDesc')
    ;
  });


  it('should return the steps', () => {
    expect(stage.getSteps())
      .toEqual([])
    ;
  });

  it('should add a step', () => {
    let step = jasmine.createSpyObj('step', ['']);

    expect(stage.addStep(step))
      .toBe(stage)
    ;

    expect(stage.getSteps())
      .toEqual([step])
    ;
  });

  it('should return if it is a server side stage', () => {
    expect(stage.isServerSide())
      .toEqual(false)
    ;
  });

  it('should set whether or not it a server side stage', () => {
    expect(stage.setServerSide(true))
      .toBe(stage)
    ;

    expect(stage.isServerSide())
      .toBe(true)
    ;
  });

  it('should serialize to JSON', () => {
    let step = jasmine.createSpyObj('step', ['toJson']);
    step.toJson.and.returnValue('step');
    stage.addStep(step);

    expect(stage.toJson())
      .toEqual({
        'name': 'Key Generation',
        'steps': [
          'step'
        ]
      });

  });

});