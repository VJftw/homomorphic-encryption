import {Injectable} from 'angular2/core';

import {Stage} from "../model/computation/stage";


@Injectable()
export class StageProviderService {

  /**
   * Creates a Stage
   * @param name
   * @param host
   * @returns {Stage}
   */
  public create(name: string, host = 0): Stage {
    let stage = new Stage();

    stage
      .setName(name)
      .setHost(host)
    ;

    return stage;
  }
}
