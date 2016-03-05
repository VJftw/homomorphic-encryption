import {
  it
} from 'angular2/testing';

import {StageProvider} from './stage_provider';

describe('StageProvider', () => {

  let stageProvider: StageProvider;

  beforeEach(() => {
    stageProvider = new StageProvider();
  });

  it('should return a stage with the given parameters', () => {
    let stage = stageProvider.create('Workspace');

    expect(stage.getName())
      .toEqual('Workspace')
    ;

    expect(stage.getHost())
      .toBe(0)
    ;

    stage = stageProvider.create('Test', 1);

    expect(stage.getName())
      .toEqual('Test')
    ;

    expect(stage.getHost())
      .toBe(1)
    ;
  });
});
