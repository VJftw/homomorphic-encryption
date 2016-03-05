import {Injectable} from 'angular2/core';

import {Stage} from '../model/stage';


@Injectable()
export class StageProvider {

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
