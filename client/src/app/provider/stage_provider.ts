import {Injectable} from "angular2/core";
import {Stage} from "../model/stage";

@Injectable()
export class StageProvider {

    public create(name: string): Stage {
        let stage = new Stage();

        stage
            .setName(name)
        ;

        return stage;
    }
}
